const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')
const { generateBothTokens } = require('../utils/jwt')

const PENDING_PAYMENT_STATUSES = ['PENDING', 'INITIATED', 'PROCESSING']

const APPLICATION_LIST_SELECT = {
  id: true,
  refNumber: true,
  applicantId: true,
  serviceConfigId: true,
  paymentStatus: true,
  verificationStatus: true,
  status: true,
  createdAt: true,
}

async function attachApplicationRelations(applications) {
  if (!applications.length) return applications

  const applicantIds = [...new Set(applications.map((app) => app.applicantId).filter(Boolean))]
  const serviceConfigIds = [
    ...new Set(applications.map((app) => app.serviceConfigId).filter(Boolean)),
  ]

  const [applicants, serviceConfigs] = await Promise.all([
    applicantIds.length
      ? prisma.user.findMany({
          where: { id: { in: applicantIds } },
          select: { id: true, fullName: true, email: true, phone: true },
        })
      : [],
    serviceConfigIds.length
      ? prisma.serviceConfig.findMany({
          where: { id: { in: serviceConfigIds } },
          select: { id: true, name: true, serviceType: true },
        })
      : [],
  ])

  const applicantById = new Map(applicants.map((user) => [user.id, user]))
  const serviceConfigById = new Map(serviceConfigs.map((config) => [config.id, config]))

  return applications.map(({ applicantId, serviceConfigId, ...app }) => ({
    ...app,
    applicant: applicantById.get(applicantId) || null,
    serviceConfig: serviceConfigById.get(serviceConfigId) || null,
  }))
}

async function safeCount(label, fn) {
  try {
    return await fn()
  } catch (error) {
    console.error(`Admin stats: ${label} failed:`, error.message)
    return 0
  }
}

async function safeFindMany(label, fn) {
  try {
    return await fn()
  } catch (error) {
    console.error(`Admin stats: ${label} failed:`, error.message)
    return []
  }
}

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
      safeCount('applications', () => prisma.application.count()),
      safeCount('pending payments', () =>
        prisma.payment.count({
          where: { status: { in: PENDING_PAYMENT_STATUSES } },
        })
      ),
      safeCount('successful payments', () =>
        prisma.payment.count({ where: { status: 'SUCCESS' } })
      ),
      safeCount('staff', () => prisma.staffProfile.count()),
      safeFindMany('recent applications', async () => {
        const rows = await prisma.application.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: APPLICATION_LIST_SELECT,
        })
        return attachApplicationRelations(rows)
      }),
      safeFindMany('recent payments', () =>
        prisma.payment.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            referenceNumber: true,
            status: true,
            createdAt: true,
          },
        })
      ),
      safeFindMany('recent transactions', () =>
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
        })
      ),
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
    const rows = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      select: APPLICATION_LIST_SELECT,
    })
    return attachApplicationRelations(rows)
  }

  static async listPayments() {
    const [payments, transactions] = await Promise.all([
      safeFindMany('payments list', async () => {
        const payments = await prisma.payment.findMany({
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            referenceNumber: true,
            amountInKobo: true,
            status: true,
            createdAt: true,
            applicationId: true,
          },
        })

        const applicationIds = [...new Set(payments.map((p) => p.applicationId).filter(Boolean))]
        const applications = applicationIds.length
          ? await prisma.application.findMany({
              where: { id: { in: applicationIds } },
              select: {
                id: true,
                applicantId: true,
                serviceConfigId: true,
              },
            })
          : []

        const withApplicants = await attachApplicationRelations(applications)
        const applicationById = new Map(withApplicants.map((app) => [app.id, app]))

        return payments.map(({ applicationId, ...payment }) => ({
          ...payment,
          application: applicationById.get(applicationId) || null,
        }))
      }),
      safeFindMany('transactions list', () =>
        prisma.transaction.findMany({
          orderBy: { id: 'desc' },
          select: {
            id: true,
            transactionRef: true,
            fullName: true,
            email: true,
            type: true,
            amount: true,
            status: true,
            user: { select: { fullName: true, email: true } },
          },
        })
      ),
    ])

    return { payments, transactions }
  }
}

module.exports = AdminService
