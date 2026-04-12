import { IdentificationForm } from '@/components/forms/identification-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Local Government Identification',
  description: 'Apply for your local government identification document.',
}

export default function IdentificationPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Local Government Identification
          </h1>
          <p className="text-lg text-foreground/70">
            Apply for your official local government identification document with our streamlined online process.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <IdentificationForm />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Requirements Card */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Valid date of birth',
                    'Current phone number',
                    'Valid email address',
                    'Residential address',
                    'Next of kin information',
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/70">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-primary">1-2 Days</p>
                  <p className="text-sm text-foreground/70">Submission & Verification</p>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-primary">3-5 Days</p>
                  <p className="text-sm text-foreground/70">Processing & Approval</p>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-primary">1 Day</p>
                  <p className="text-sm text-foreground/70">Collection/Delivery</p>
                </div>
              </CardContent>
            </Card>

            {/* Fee Card */}
            <Card className="bg-accent/10 border-accent">
              <CardHeader>
                <CardTitle className="text-accent">Application Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary mb-2">NGN 5,000</p>
                <p className="text-sm text-foreground/70">One-time payment for processing and delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
