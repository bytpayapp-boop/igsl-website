// Backend service for handling anonymous messages
// This should be imported and used in your server-side API routes

export interface AnonymousMessageInput {
  message: string
  fullName?: string
  email?: string
  phone?: string
  category: 'general' | 'complaint' | 'suggestion' | 'commendation' | 'report' | 'other'
  ipAddress?: string
  userAgent?: string
}

export interface AnonymousMessageOutput {
  success: boolean
  message: string
  messageId: string
  timestamp: string
}

/**
 * Service to handle anonymous message submission
 * Integrate with your database (Prisma) to store messages
 */
export class AnonymousMessageService {
  /**
   * Submit an anonymous message
   * 
   * @param input - The message data
   * @param lgaId - The LGA ID (local government area)
   * @param prisma - Prisma client instance
   * @returns Promise<AnonymousMessageOutput>
   * 
   * @example
   * const result = await submitAnonymousMessage(
   *   { message: 'Some feedback...', category: 'suggestion' },
   *   'lga-id-123',
   *   prismaClient
   * )
   */
  static async submitAnonymousMessage(
    input: AnonymousMessageInput,
    lgaId: string,
    prisma: any
  ): Promise<AnonymousMessageOutput> {
    try {
      // Validate required fields
      if (!input.message || input.message.trim().length === 0) {
        throw new Error('Message cannot be empty')
      }

      if (!input.category) {
        throw new Error('Category is required')
      }

      // Create the message in database
      const anonymousMessage = await prisma.anonymousMessage.create({
        data: {
          lgaId,
          message: input.message.trim(),
          fullName: input.fullName || null,
          email: input.email || null,
          phone: input.phone || null,
          category: input.category.toUpperCase(),
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          status: 'RECEIVED',
          submittedAt: new Date(),
        },
      })

      return {
        success: true,
        message: 'Your message has been received. Thank you for your feedback.',
        messageId: anonymousMessage.id,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error submitting anonymous message:', error)
      throw error
    }
  }

  /**
   * Get all anonymous messages (Admin only)
   */
  static async getMessages(lgaId: string, prisma: any, filters?: any) {
    try {
      const messages = await prisma.anonymousMessage.findMany({
        where: {
          lgaId,
          ...(filters?.status && { status: filters.status }),
          ...(filters?.category && { category: filters.category }),
        },
        orderBy: {
          submittedAt: 'desc',
        },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      })

      return messages
    } catch (error) {
      console.error('Error retrieving messages:', error)
      throw error
    }
  }

  /**
   * Update message status (Admin only)
   */
  static async updateMessageStatus(
    messageId: string,
    status: string,
    reviewNote?: string,
    reviewedBy?: string,
    prisma?: any
  ) {
    try {
      const updated = await prisma.anonymousMessage.update({
        where: { id: messageId },
        data: {
          status,
          reviewNote,
          reviewedBy,
          reviewedAt: new Date(),
        },
      })

      return updated
    } catch (error) {
      console.error('Error updating message status:', error)
      throw error
    }
  }

  /**
   * Get message statistics
   */
  static async getStatistics(lgaId: string, prisma: any) {
    try {
      const stats = await prisma.anonymousMessage.groupBy({
        by: ['category', 'status'],
        where: { lgaId },
        _count: true,
      })

      return stats
    } catch (error) {
      console.error('Error retrieving statistics:', error)
      throw error
    }
  }
}
