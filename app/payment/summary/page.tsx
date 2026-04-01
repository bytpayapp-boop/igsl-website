'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

const FEES = {
  identification: 5000,
  'birth-certificate': 3500,
}

export default function PaymentSummaryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'identification'
  const [isProcessing, setIsProcessing] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const applicationData = typeof window !== 'undefined' ? 
    JSON.parse(sessionStorage.getItem('applicationData') || '{}') : 
    {}

  const amount = FEES[type as keyof typeof FEES] || 5000
  const typeName = type === 'identification' ? 'Local Government ID' : 'Birth Certificate'

  const handlePayment = async () => {
    if (!accepted) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsProcessing(true)
    try {
      // Simulate Flutterwave payment flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Randomly succeed or fail for demo purposes (90% success rate)
      const success = Math.random() > 0.1

      if (success) {
        // Store transaction data
        sessionStorage.setItem(
          'transaction',
          JSON.stringify({
            reference: `TRX-${Date.now()}`,
            amount,
            type,
            timestamp: new Date().toISOString(),
          })
        )
        router.push('/payment/success')
      } else {
        router.push('/payment/failed')
      }
    } catch (error) {
      toast.error('Payment processing failed')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Payment Summary</h1>
          <p className="text-foreground/70">Review and confirm your payment details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Application Details */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Application Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Application Type:</span>
                  <span className="font-medium text-foreground">{typeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Applicant:</span>
                  <span className="font-medium text-foreground">
                    {applicationData.fullName || applicationData.childFullName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Processing Time:</span>
                  <span className="font-medium text-foreground">
                    {type === 'identification' ? '5-7 business days' : '3-5 business days'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Amount Breakdown */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Amount Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Application Fee:</span>
                  <span className="font-medium">NGN {amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Processing Fee:</span>
                  <span className="font-medium">NGN 0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Delivery Fee:</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary">Total Amount Due:</span>
                <span className="text-3xl font-bold text-primary">
                  NGN {amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold text-primary mb-3">Payment Method</h3>
              <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/20">
                <p className="text-sm text-foreground/70 mb-2">Secure Payment Gateway</p>
                <p className="font-medium text-foreground">Flutterwave Payment Processing</p>
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-foreground">
                  I acknowledge that I have reviewed the application details and the charges
                  above. I authorize IGSL to process my payment for the application. I
                  understand that this payment is non-refundable unless the application is rejected
                  due to government error.
                </span>
              </label>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={!accepted || isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? 'Processing Payment...' : 'Proceed to Payment'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            {/* Back Link */}
            <div className="text-center">
              <Link href={`/services/${type === 'identification' ? 'identification' : 'birth-certificate'}`}>
                <Button variant="ghost">Back to Application</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-8 text-center text-sm text-foreground/70">
          <p>🔒 Your payment is secure and encrypted</p>
          <p className="mt-2">Payment is processed through Flutterwave Payment Gateway</p>
        </div>
      </div>
    </div>
  )
}
