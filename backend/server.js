const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const {  authTokenMiddleWare,
    authRefreshMiddleware} = require('./middleware/auth');

const {generateBothTokens, generateAccessToken}= require('./utils/jwt')

dotenv.config()

const AuthService = require('./services/authService')

const app = express()
const PORT = process.env.PORT || 3001

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
console.log('Registration successful')
   const token = generateAccessToken(result.user);
    res.status(201).json({...result,token})
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
