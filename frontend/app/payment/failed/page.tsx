'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function PaymentFailedPage() {
  const [transaction, setTransaction] = useState<any>(null)

  useEffect(() => {
    const txData = sessionStorage.getItem('transaction')
    if (txData) {
      setTransaction(JSON.parse(txData))
    }
  }, [])

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Banner */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold text-destructive mb-2">Payment Failed</h1>
          <p className="text-lg text-foreground/70">
            Unfortunately, your payment could not be processed at this time.
          </p>
        </div>

        {/* Error Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <p className="text-destructive font-semibold mb-2">✗ Payment Failed</p>
              <p className="text-sm text-foreground">
                Your payment could not be processed. This could be due to insufficient funds,
                incorrect card details, or a temporary network issue.
              </p>
            </div>

            {/* Possible Reasons */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Possible Reasons</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Incorrect card or account details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Card expired or suspended</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Temporary network connectivity issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Bank declined the transaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Daily transaction limit exceeded</span>
                </li>
              </ul>
            </div>

            <Separator />

            {/* What To Do */}
            <div>
              <h3 className="font-semibold text-primary mb-4">What Can You Do?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                    <span className="font-semibold text-primary text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Check Your Payment Method</p>
                    <p className="text-foreground/70">Verify that your card/account has sufficient funds and is active.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                    <span className="font-semibold text-primary text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Try Another Payment Method</p>
                    <p className="text-foreground/70">Attempt the payment again with a different card or account.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                    <span className="font-semibold text-primary text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Contact Your Bank</p>
                    <p className="text-foreground/70">Check with your bank to ensure there are no blocks on transactions.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                    <span className="font-semibold text-primary text-xs">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Contact Support</p>
                    <p className="text-foreground/70">Reach out to our support team if the issue persists.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/payment/summary" className="flex-1">
                <Button className="w-full" size="lg">
                  <RotateCcw className="mr-2 w-4 h-4" />
                  Try Payment Again
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-primary mb-3">Need Help?</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Our support team is available to assist you with payment issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:support@igsl.gov" className="text-primary hover:underline">
                    support@igsl.gov
                  </a>
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a href="tel:+234800123456" className="text-primary hover:underline">
                    +234-800-123-4567
                  </a>
                </div>
                <div>
                  <p className="font-medium text-foreground">Office Hours</p>
                  <p className="text-foreground/70">Mon-Fri, 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
