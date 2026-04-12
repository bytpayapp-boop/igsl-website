import { BirthCertificateForm } from '@/components/forms/birth-certificate-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Birth Certificate Registration',
  description: 'Apply for a birth certificate registration and obtain your certified copy.',
}

export default function BirthCertificatePage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Birth Certificate Registration
          </h1>
          <p className="text-lg text-foreground/70">
            Register your child&apos;s birth and obtain a certified birth certificate with our simplified online process.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <BirthCertificateForm />
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
                    'Child&apos;s full name',
                    'Date of birth',
                    'Place of birth',
                    'Parent names',
                    'Residential address',
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
                  <p className="text-sm text-foreground/70">Application Review</p>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-primary">2-3 Days</p>
                  <p className="text-sm text-foreground/70">Certificate Issuance</p>
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
                <p className="text-3xl font-bold text-primary mb-2">NGN 3,500</p>
                <p className="text-sm text-foreground/70">Includes one certified copy</p>
              </CardContent>
            </Card>

            {/* Note */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Important Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">
                  Applications can be submitted within one year of birth for normal registration, or at any time for late registration with additional requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
