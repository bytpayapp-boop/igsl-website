const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const { generateBothTokens } = require('../utils/jwt')

const prisma = new PrismaClient()

const PENDING_PAYMENT_STATUSES = ['PENDING', 'INITIATED', 'PROCESSING']

class AdminService {
  static async login(credentials) {
    try {
      const { email, password } = credentials

      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const admin = await prisma.adminUser.findUnique({
        where: { email: email.trim().toLowerCase() },
      })

      if (!admin) {
        throw new Error('Invalid email or password')
      }

      if (!admin.isActive) {
        throw new Error('Admin account is inactive')
      }

      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)
      if (!isPasswordValid) {
        throw new Error('Invalid email or password')
      }

      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() },
      })

      const tokenPayload = {
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        tokenType: 'admin',
      }

      const tokens = generateBothTokens(tokenPayload)

      return {
        success: true,
        message: 'Login successful',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
        },
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  static async getAdminById(adminId) {
    return prisma.adminUser.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    })
  }

  static async getDashboardStats() {
    const [
      totalApplications,
      pendingPayments,
      successfulPayments,
      staffCount,
      recentApplications,
      recentPayments,
      recentTransactions,
    ] = await Promise.all([
      prisma.application.count(),
      prisma.payment.count({
        where: { status: { in: PENDING_PAYMENT_STATUSES } },
      }),
      prisma.payment.count({ where: { status: 'SUCCESS' } }),
      prisma.staffProfile.count(),
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          applicant: {
            select: { fullName: true, email: true, phone: true },
          },
          serviceConfig: { select: { name: true, serviceType: true } },
        },
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          application: {
            include: {
              applicant: { select: { fullName: true, email: true } },
              serviceConfig: { select: { name: true } },
            },
          },
        },
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          amount: true,
          status: true,
          transactionRef: true,
          type: true,
        },
      }),
    ])

    const recentActivities = [
      ...recentApplications.map((app) => ({
        id: app.id,
        type: 'application',
        description: `Application ${app.refNumber} submitted by ${app.applicant?.fullName || 'Unknown'}`,
        timestamp: app.createdAt,
      })),
      ...recentPayments.map((payment) => ({
        id: payment.id,
        type: 'payment',
        description: `Payment ${payment.referenceNumber} — ${payment.status}`,
        timestamp: payment.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8)

    return {
      totalApplications,
      pendingPayments,
      successfulPayments,
      staffCount,
      recentApplications,
      recentActivities,
      recentTransactions,
    }
  }

  static async listApplications() {
    return prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        applicant: {
          select: { fullName: true, email: true, phone: true },
        },
        serviceConfig: { select: { name: true, serviceType: true } },
      },
    })
  }

  static async listPayments() {
    const [payments, transactions] = await Promise.all([
      prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          application: {
            include: {
              applicant: { select: { fullName: true, email: true } },
              serviceConfig: { select: { name: true, serviceType: true } },
            },
          },
        },
      }),
      prisma.transaction.findMany({
        orderBy: { id: 'desc' },
        include: {
          user: { select: { fullName: true, email: true } },
        },
      }),
    ])

    return { payments, transactions }
  }
}

module.exports = AdminService
