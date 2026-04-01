'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Printer, Home, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { LocalGovtIdTemplate } from '@/components/certificates/local-govt-id-template'
import { BirthCertificateTemplate } from '@/components/certificates/birth-certificate-template'

export default function CertificatePage() {
  const params = useParams()
  const certificateId = params.id as string
  const [certificateType, setCertificateType] = useState<'identification' | 'birth-certificate'>('identification')
  const [applicantData, setApplicantData] = useState<any>(null)

  useEffect(() => {
    // Get application data from session
    const appData = sessionStorage.getItem('applicationData')
    if (appData) {
      setApplicantData(JSON.parse(appData))
      // Detect certificate type based on data
      if (JSON.parse(appData).childFullName) {
        setCertificateType('birth-certificate')
      }
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast.success('Certificate download feature coming soon')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateId)
    toast.success('Reference number copied to clipboard')
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Your Certificate</h1>
          <p className="text-foreground/70">Official government certificate for your records</p>
        </div>

        {/* Reference & Actions */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-foreground/70 mb-1">Certificate Reference</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-semibold text-primary">
                    {certificateId}
                  </span>
                  <Button size="sm" variant="ghost" onClick={handleCopy}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button onClick={handlePrint}>
                  <Printer className="mr-2 w-4 h-4" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" disabled>
                  <Copy className="mr-2 w-4 h-4" />
                  Share Certificate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Template */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8 print:shadow-none">
          {certificateType === 'identification' ? (
            <LocalGovtIdTemplate data={applicantData} referenceNumber={certificateId} />
          ) : (
            <BirthCertificateTemplate data={applicantData} referenceNumber={certificateId} />
          )}
        </div>

        {/* Information Card */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-semibold text-primary mb-3">Certificate Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Certificate Type:</span>
                  <span className="font-medium text-foreground capitalize">
                    {certificateType === 'identification'
                      ? 'Local Government ID'
                      : 'Birth Certificate'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Issue Date:</span>
                  <span className="font-medium text-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Validity:</span>
                  <span className="font-medium text-foreground">Permanent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm text-foreground/70 border border-blue-200">
              <p>
                <strong>Note:</strong> This certificate is official and can be presented as proof of the application status. Keep the reference number safe for future inquiries.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <p className="text-foreground/70 mb-4">Ready to proceed with collecting your official document?</p>
          <Button variant="outline">
            <Home className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:shadow-none {
            box-shadow: none;
          }
          button {
            display: none;
          }
          .max-w-5xl {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
