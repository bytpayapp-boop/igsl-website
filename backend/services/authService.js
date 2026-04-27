const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { generateAccessToken, generateBothTokens } = require('../utils/jwt')

const prisma = new PrismaClient()


class AuthService {
  /**
   * Register a new user (citizen)
   */
  static async register(data) {
    try {
      const { username, email, password, phone, lgaId } = data
console.log('Payload for this registration:',data)
      // Validate input
      if (!username || !email || !password || !phone) {
        throw new Error('Username, email, password, and phone are required')
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      })

      if (existingUser) {
        throw new Error('User with this email or phone already exists')
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10)

    //   // Extract first and last name from username for basic identity
    //   const nameParts = username.split(' ')
    //   const firstName = nameParts[0]
    //   const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]

    //   // Create user
      const user = await prisma.user.create({
        data: {
        
          fullName: username,
          email,
          phone,
          passwordHash,
          // lgaId: lgaId || 'default-lga', // Ensure LGA is set
          userType: 'CITIZEN',
          isActive: true,
          isEmailVerified: false,
          isPhoneVerified: false,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          userType: true,
          createdAt: true,
        },
      });
      return{
        success:true,
        message:'Registration is now successful',
        user
      }

    
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Login user with username/email and password
   */
  static async login(credentials) {
    try {
      const { username, password } = credentials

      if (!username || !password) {
        throw new Error('Username and password are required')
      }

      // Find user by email or phone (treating username as either)
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: username }, { phone: username }, { fullName: username }],
        },
        include: {
          staffProfile: true,
        },
      })

      if (!user) {
        throw new Error('Invalid username or password')
      }

      if (!user.isActive) {
        throw new Error('User account is inactive')
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

      if (!isPasswordValid) {
        throw new Error('Invalid username or password')
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })

      // Generate tokens
      let userDetail;
      let {staffProfile, ...rest}=user;
      userDetail = {...rest};
     const tokens = generateBothTokens(userDetail);

     console.log('Both tokens are genereated:',tokens)

      return {
        success: true,
        message: 'Login successful',
        aaccessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          staffProfile: user.staffProfile || null,
        },
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Verify JWT token
   */
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return {
        valid: true,
        decoded,
      }
    } catch (error) {
      return {
        valid: false,
        message: error.message,
      }
    }
  }

  /**
   * Generate password reset token
   */
  static async generatePasswordResetToken(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Generate reset token (valid for 1 hour)
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenHash = await bcrypt.hash(resetToken, SALT_ROUNDS)
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Store hashed token in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetTokenHash,
          resetTokenExpiry,
        },
      })

      return {
        success: true,
        resetToken, // Send this to user via email
        message: 'Reset token generated',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Reset password using token
   */
  static async resetPassword(email, resetToken, newPassword) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Verify reset token
      if (!user.resetTokenHash || !user.resetTokenExpiry) {
        throw new Error('No reset token found')
      }

      if (new Date() > user.resetTokenExpiry) {
        throw new Error('Reset token has expired')
      }

      const isTokenValid = await bcrypt.compare(resetToken, user.resetTokenHash)

      if (!isTokenValid) {
        throw new Error('Invalid reset token')
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newPasswordHash,
          resetTokenHash: null,
          resetTokenExpiry: null,
        },
      })

      return {
        success: true,
        message: 'Password reset successful',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Update password (requires old password)
   */
  static async updatePassword(userId, oldPassword, newPassword) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash)

      if (!isOldPasswordValid) {
        throw new Error('Old password is incorrect')
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      })

      return {
        success: true,
        message: 'Password updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          staffProfile: true,
          addresses: true,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          fullName: true,
          email: true,
          phone: true,
          gender: true,
          dateOfBirth: true,
          nin: true,
          nationalIdVerified: true,
          occupation: true,
          placeOfBirth: true,
          profilePhotoUrl: true,
          userType: true,
          isActive: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          staffProfile: true,
          addresses: true,
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      return {
        success: true,
        user,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId, updates) {
    try {
      // Prevent updating sensitive fields
      const { passwordHash, userType, email, phone, ...safeUpdates } = updates

      const user = await prisma.user.update({
        where: { id: userId },
        data: safeUpdates,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          fullName: true,
          email: true,
          phone: true,
          profilePhotoUrl: true,
          userType: true,
          updatedAt: true,
        },
      })

      return {
        success: true,
        message: 'Profile updated successfully',
        user,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Send email verification OTP
   */
  static async sendEmailVerificationOtp(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      if (user.isEmailVerified) {
        throw new Error('Email already verified')
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Store OTP (in production, use dedicated OTP table)
      await prisma.otpCode.create({
        data: {
          userId,
          code: otp,
          type: 'EMAIL_VERIFICATION',
          expiresAt: otpExpiry,
        },
      })

      // In production, send OTP via email service
      return {
        success: true,
        message: 'OTP sent to email',
        otp, // Remove in production
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Verify email with OTP
   */
  static async verifyEmailOtp(userId, otp) {
    try {
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          userId,
          code: otp,
          type: 'EMAIL_VERIFICATION',
          expiresAt: { gt: new Date() },
        },
      })

      if (!otpRecord) {
        throw new Error('Invalid or expired OTP')
      }

      // Mark email as verified
      await prisma.user.update({
        where: { id: userId },
        data: { isEmailVerified: true },
      })

      // Delete OTP
      await prisma.otpCode.delete({
        where: { id: otpRecord.id },
      })

      return {
        success: true,
        message: 'Email verified successfully',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  /**
   * Logout user (mainly for audit purposes)
   */
  static async logout(userId) {
    try {
      // In a production app, you might invalidate tokens here
      // For now, just log the logout action
      return {
        success: true,
        message: 'Logged out successfully',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}

module.exports = AuthService

