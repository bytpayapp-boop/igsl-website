import { NextRequest, NextResponse } from 'next/server'

// Hardcoded LGA ID - Replace with actual value from your system
const LGA_ID = process.env.NEXT_PUBLIC_LGA_ID || 'igbo-eze-south'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { message, fullName, email, phone, category, timestamp } = body

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Normalize category
    const normalizedCategory = category?.toLowerCase() || 'general'
    const validCategories = ['general', 'complaint', 'suggestion', 'commendation', 'report', 'other']
    
    if (!validCategories.includes(normalizedCategory)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Get client IP for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const userAgent = request.headers.get('user-agent') || ''

    // Prepare the message data
    const messageData = {
      message: message.trim(),
      fullName: fullName || 'Anonymous',
      email: email || '',
      phone: phone || '',
      category: normalizedCategory,
      ipAddress,
      userAgent,
      timestamp,
    }

    // Try to send to backend API if configured
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    
    try {
      const backendResponse = await fetch(`${backendUrl}/api/anonymous-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageData,
          lgaId: LGA_ID,
        }),
      })

      if (backendResponse.ok) {
        const backendData = await backendResponse.json()
        return NextResponse.json(
          {
            success: true,
            message: 'Your message has been received. Thank you for your feedback.',
            messageId: backendData.messageId || `MSG-${Date.now()}`,
            timestamp: new Date().toISOString()
          },
          { status: 200 }
        )
      }
    } catch (backendError) {
      console.warn('Backend API not available, logging locally:', backendError)
      // Continue with local logging if backend is unavailable
    }

    // Log locally if backend is not available
    console.log('Anonymous Message Received:', {
      message: message.substring(0, 100) + '...',
      category: normalizedCategory,
      fullName: fullName || 'Anonymous',
      email: email || 'Not provided',
      phone: phone || 'Not provided',
      ipAddress,
      userAgent: userAgent.substring(0, 100),
      timestamp,
      receivedAt: new Date().toISOString()
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. Thank you for your feedback.',
        messageId: `MSG-${Date.now()}`,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing anonymous message:', error)
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again later.' },
      { status: 500 }
    )
  }
}

// Optional: Handle GET request to check API health
export async function GET() {
  return NextResponse.json(
    { message: 'Anonymous message API is running' },
    { status: 200 }
  )
}
