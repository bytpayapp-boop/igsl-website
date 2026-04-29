'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, Home, FileText } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import dayjs from 'dayjs'
import { timeStamp } from 'console'

export default function PaymentSuccessPage() {
  const [transaction, setTransaction] = useState<any>(null);
  const[user,setUser]=useState(null)

  useEffect(() => {
    const txData = sessionStorage.getItem('transaction');
    const user = localStorage.getItem('user');
    if(user){setUser(user)}
    console.log('Tansaction data from success page:',txData)
    if (txData) {
      setTransaction(JSON.parse(txData))
    }
  }, [])

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Payment Successful!</h1>
          <p className="text-lg text-foreground/70">
            Your application has been received and payment confirmed.
          </p>
        </div>

        {/* Confirmation Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Confirmation Details */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-900 font-semibold mb-2">✓ Payment Confirmed</p>
              <p className="text-sm text-green-800">
                Your payment has been processed successfully. Keep this reference number for
                your records.
              </p>
            </div>

            {/* Transaction Details */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Transaction Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground">Reference Number:</span>
                  <span className="font-mono font-medium text-foreground">
                    {transaction?.reference || 'TRX-XXXXXXXX'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Amount Paid:</span>
                  <span className="font-medium text-foreground">
                    NGN {transaction?.amount?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Application Type:</span>
                  <span className="font-medium text-foreground capitalize">
                    {transaction?.type === 'identification' ? 'Local Government ID' : 'Birth Certificate'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Date & Time:</span>
                  <span className="font-medium text-foreground">
                    {transaction?.timestamp
                      ? dayjs(Date.now()).format('DD MMMM, YYYY hh:mm A')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold text-primary mb-4">What&apos;s Next?</h3>
              <div className="space-y-3">
                {[
                  {
                    num: '1',
                    title: 'Application Review',
                    desc: 'Your application will be reviewed by our team within 1-2 business days.',
                  },
                
                  {
                    num: '2',
                    title: 'Notification',
                    desc: 'You will receive an email/SMS notification when your document is ready.',
                  },
                  {
                    num: '3',
                    title: 'Collection/Delivery',
                    desc: 'You can collect your document or have it delivered to your address.',
                  },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                      <span className="font-semibold text-primary text-sm">{step.num}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{step.title}</p>
                      <p className="text-sm text-foreground/70">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Important Notes */}
            <div className="bg-blue-50 border dark:bg-gray-800 border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Important Notes</h4>
              <ul className="space-y-1 text-sm text-foreground/70">
                <li>• Keep your reference number for tracking and inquiry purposes</li>
                <li>• Check your email for updates on your application status</li>
                <li>• Do not share your reference number with anyone</li>
                <li>• Your payment is non-refundable unless rejected due to government error</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" size="lg">
                <Download className="mr-2 w-4 h-4" />
                Download Receipt
              </Button>
              <Link href={`/certificate/${transaction?.reference || ''}`} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <FileText className="mr-2 w-4 h-4" />
                  View Certificate
                </Button>
              </Link>
            </div>

            {/* Back Home */}
            {user?<div className="text-center">
              <Link href="/dashboard">
                <Button variant="ghost">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>:<div className="text-center">
              <Link href="/">
                <Button variant="ghost">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-foreground/70 mb-3">
                Need help? Contact us for assistance with your application.
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
