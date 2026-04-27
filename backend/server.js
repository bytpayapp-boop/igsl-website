const express = require('express')
const cors = require('cors')
const {PrismaClient} = require('@prisma/client')
const dotenv = require('dotenv')
const {  authTokenMiddleWare,
    authRefreshMiddleware} = require('./middleware/auth');

const {generateBothTokens, generateAccessToken, verifyRefreshToken}= require('./utils/jwt')

dotenv.config()

const AuthService = require('./services/authService')

const app = express()
const PORT = process.env.PORT || 3001

const prisma = new PrismaClient()

// Helper function to convert BigInt to string for JSON serialization
const serializeBigInt = (data) => {
  if (data === null || data === undefined) return data
  if (typeof data === 'bigint') return data.toString()
  if (Array.isArray(data)) return data.map(serializeBigInt)
  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = serializeBigInt(data[key])
      return acc
    }, {})
  }
  return data
}

// Middlewares
// Allow requests from Render frontend
app.use(cors({
origin: [
    'https://igsl-website.onrender.com',
    'http://localhost:3000', // For local development
  ],
  credentials: true,
}))
app.use(express.json())

// Health check
app.head('/health', (req, res) => {
  console.log('HEAD api wake-up call from Uptimerobot')
  res.json({ status: 'ok', message: 'Backend server is running' })
})

// ===== AUTH ROUTES =====

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    console.log('Incoming registration from:',req.body.email);

    // Validate required fields
    if (!username || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, and phone are required',
      })
    }

    const result = await AuthService.register({
      username,
      email,
      password,
      phone,
      lgaId: process.env.DEFAULT_LGA_ID || 'default-lga',
    })
console.log('Registration successful');
console.log('Registered data:',result)
   const tokens = generateBothTokens(result.user);
    res.status(201).json({...result, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken})
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/login
 * User login
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    console.log(`${username} logging back in`)

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    const result = await AuthService.login({ username, password })

    if (!result.success) {
      return res.status(401).json(result)
    }

    console.log('Logged in successfully')
    res.status(200).json(result)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/verify-token
 * Verify JWT token
 */
app.post('/api/auth/verify-token', (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        valid: false,
        message: 'Token is required',
      })
    }

    const result = AuthService.verifyToken(token)
    res.status(200).json(result)
  } catch (error) {
    console.error('Verify token error:', error)
    res.status(500).json({
      valid: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 */
app.post('/api/auth/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      })
    }

    const payload = verifyRefreshToken(refreshToken)
    
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      })
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(payload)

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      message: 'Token refreshed successfully',
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).json({
      success: false,
      message: 'Failed to refresh token',
    })
  }
})

/**
 * POST /api/auth/forgot-password
 * Generate password reset token
 */
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      })
    }

    const result = await AuthService.generatePasswordResetToken(email)

    if (!result.success) {
      return res.status(400).json(result)
    }

    // In production, send email with reset token here
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      // Don't return the token in production!
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, reset token, and new password are required',
      })
    }

    const result = await AuthService.resetPassword(email, resetToken, newPassword)

    if (!result.success) {
      return res.status(400).json(result)
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/update-password
 * Update password (requires authentication)
 */
app.post('/api/auth/update-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'User ID, old password, and new password are required',
      })
    }

    const result = await AuthService.updatePassword(userId, oldPassword, newPassword)

    if (!result.success) {
      return res.status(400).json(result)
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Update password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * GET /api/auth/profile/:userId
 * Get user profile
 */
app.get('/api/auth/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      })
    }

    const result = await AuthService.getUserProfile(userId)

    if (!result.success) {
      return res.status(404).json(result)
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * PUT /api/auth/profile/:userId
 * Update user profile
 */
app.put('/api/auth/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      })
    }

    const result = await AuthService.updateUserProfile(userId, updates)

    if (!result.success) {
      return res.status(400).json(result)
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/send-verification-otp
 * Send email verification OTP
 */
app.post('/api/auth/send-verification-otp', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      })
    }

    const result = await AuthService.sendEmailVerificationOtp(userId)

    if (!result.success) {
      return res.status(400).json(result)
    }

    // Remove OTP from response in production
    res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/verify-email-otp
 * Verify email with OTP
 */
app.post('/api/auth/verify-email-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID and OTP are required',
      })
    }

    const result = await AuthService.verifyEmailOtp(userId, otp)

    if (!result.success) {
      return res.status(400).json(result)
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/auth/logout
 * User logout
 */
app.post('/api/auth/logout', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      })
    }

    const result = await AuthService.logout(userId)
    res.status(200).json(result)
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// ===== ANONYMOUS MESSAGE ROUTES =====

/**
 * POST /api/anonymous-message
 * Submit an anonymous message
 */
app.post('/api/anonymous-message', async (req, res) => {
  try {
    const { message, fullName, email, phone, category, lgaId, ipAddress, userAgent } = req.body

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      })
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      })
    }

    // Log the anonymous message (for now, just console.log)
    // TODO: Save to database using Prisma when database is set up
    const messageLog = {
      id: `MSG-${Date.now()}`,
      message: message.substring(0, 100) + '...',
      category,
      fullName: fullName || 'Anonymous',
      email: email || 'Not provided',
      phone: phone || 'Not provided',
      lgaId: lgaId || 'default-lga',
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent ? userAgent.substring(0, 100) : 'unknown',
      receivedAt: new Date().toISOString(),
      status: 'RECEIVED'
    }

    console.log('Anonymous Message Received:', messageLog)

    // TODO: Database integration example (uncomment when database is ready):
    // const anonymousMessage = await prisma.anonymousMessage.create({
    //   data: {
    //     message: message.trim(),
    //     fullName: fullName || 'Anonymous',
    //     email: email || null,
    //     phone: phone || null,
    //     category: category.toUpperCase(),
    //     lgaId: lgaId || 'default-lga',
    //     ipAddress,
    //     userAgent,
    //     status: 'RECEIVED',
    //     submittedAt: new Date(),
    //   }
    // })

    res.status(200).json({
      success: true,
      message: 'Your message has been received. Thank you for your feedback.',
      messageId: messageLog.id,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error processing anonymous message:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process your message. Please try again later.',
    })
  }
})

// ===== APPLICATION ROUTES =====

/**
 * GET /api/applications
 * Fetch all applications for the authenticated user
 */
app.get('/api/applications', authTokenMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      })
    }

    const applications = await prisma.application.findMany({
      where: {
        applicantId: userId,
      },
      include: {
        serviceConfig: true,
        payments: true,
        certificate: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.status(200).json({
      success: true,
      data: applications,
      count: applications.length,
    })
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    })
  }
})

/**
 * GET /api/applications/:id
 * Fetch a single application by ID
 */
app.get('/api/applications/:id', authTokenMiddleWare, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required',
      })
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        serviceConfig: true,
        applicant: true,
        address: true,
        payments: true,
        reviews: true,
        certificate: true,
        attachedDocuments: true,
      },
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    // Check if user is the applicant or staff
    if (application.applicantId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    res.status(200).json({
      success: true,
      data: application,
    })
  } catch (error) {
    console.error('Get application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
    })
  }
})

/**
 * POST /api/applications
 * Submit a new application
 */
app.post('/api/applications', authTokenMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id
    console.log('The application payload is:',req.body)
    const { serviceType, applicationData, addressId } = req.body

    if (!serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Service type is required',
      })
    }

    let newServiceConfig;
    

    // Get service config
    let serviceConfig = await prisma.serviceConfig.findUnique({
      where: { serviceType },
    })

    if (!serviceConfig) {
      console.log(`No service config found, creating a ${serviceType} serviceConfig`);

      if(serviceType==='BIRTH_CERTIFICATE'){
      serviceConfig = await prisma.serviceConfig.create(
        {
          data:{
            serviceType,
            name:'Birth Certificate',
            slug:'birth_certificate',
            feeInNaira: 2000,
            requiresNin:true
          }
        }
      )
    }
    else{
      serviceConfig = await prisma.serviceConfig.create(
        {
          data:{
            serviceType,
            name:'Identification Certificate',
            slug:'id_certificate',
            feeInNaira: 2000,
            requiresNin:true
          }
        }
      )
    }
     
    }

    // Generate reference number
    const refNumber = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create application
    const application = await prisma.application.create({
      data: {
        refNumber,
        serviceConfigId: serviceConfig.id,
        applicantId: userId,
        addressId: addressId || null,
        status: 'DRAFT',
        applicationData: applicationData || {},
      },
      include: {
        serviceConfig: true,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application,
    })
  } catch (error) {
    console.error('Create application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create application',
    })
  }
})

/**
 * PATCH /api/applications/:id
 * Update an application
 */
app.patch('/api/applications/:id', authTokenMiddleWare, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { applicationData, status, addressId } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required',
      })
    }

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: { id },
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    if (application.applicantId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        ...(applicationData && { applicationData }),
        ...(status && { status }),
        ...(addressId && { addressId }),
      },
      include: {
        serviceConfig: true,
        payments: true,
        certificate: true,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updatedApplication,
    })
  } catch (error) {
    console.error('Update application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
    })
  }
})

/**
 * POST /api/applications/:id/cancel
 * Cancel an application
 */
app.post('/api/applications/:id/cancel', authTokenMiddleWare, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required',
      })
    }

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: { id },
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    if (application.applicantId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    // Cancel application
    const cancelledApplication = await prisma.application.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
      include: {
        serviceConfig: true,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Application cancelled successfully',
      data: cancelledApplication,
    })
  } catch (error) {
    console.error('Cancel application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to cancel application',
    })
  }
})

/**
 * GET /api/applications/:id/download
 * Download application certificate/document
 */
app.get('/api/applications/:id/download', authTokenMiddleWare, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required',
      })
    }

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        certificate: true,
        attachedDocuments: true,
      },
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    if (application.applicantId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    if (!application.certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not yet issued for this application',
      })
    }

    // Return certificate document URL (you'll need to implement actual file download logic)
    res.status(200).json({
      success: true,
      data: {
        certificateId: application.certificate.id,
        certificateNumber: application.certificate.certificateNumber,
        issuedAt: application.certificate.issuedAt,
        expiresAt: application.certificate.expiresAt,
        message: 'Certificate download initiated',
      },
    })
  } catch (error) {
    console.error('Download document error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to download document',
    })
  }
})

/**
 * POST /api/transactions/save
 * Save transaction data before payment
 */
app.post('/api/transactions/save', authTokenMiddleWare, async (req, res) => {
  console.log('This transaction data is about to be saved',req.body);
  try {
    const { email, phone, fullName, amount, type, status, applicationData } = req.body;

    if (!email || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Email, amount, and type are required',
      });
    }

    // Generate unique transaction reference
    const transactionRef = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log transaction (TODO: Save to database with Prisma when schema is ready)
    const transactionData = {
      transactionRef,
      email,
      phone,
      fullName,
      amount,
      type,
      status: status || 'PENDING',
      applicationData,
      createdAt: new Date().toISOString(),
    };

    

    // TODO: Uncomment when database is ready
    const transaction = await prisma.transaction.create({
      data: {
        transactionRef,
        email,
        phone,
        fullName,
        amount,
        type,
        status: status || 'PENDING',
        applicationData,
      }
    });

    console.log('Transaction saved:', transactionData);

   return res.status(201).json({
      success: true,
      message: 'Transaction saved successfully',
      transactionRef,
      data: transactionData,
    });
  } catch (error) {
    console.error('Save transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save transaction',
    });
  }
});

//Flutterwave webh00k

app.post('/flutterwaveTest/trx',async(req,res)=>{
    console.log('Incoming Flutterwave webhoook with:',req.body);
})



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📝 API Documentation available at http://localhost:${PORT}/health`)
})

module.exports = app
