'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Printer, Home, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { LocalGovtIdTemplate } from '@/components/certificates/local-govt-id-template'
import { BirthCertificateTemplate } from '@/components/certificates/birth-certificate-template'
import { useReactToPrint } from "react-to-print";
import Link from 'next/link'
import * as htmlToImage from 'html-to-image'
export default function CertificatePage() {
  const params = useParams()
  const certificateId = params.id as string
  const [certificateType, setCertificateType] = useState<'identification' | 'birth-certificate'>('identification')
  const [applicantData, setApplicantData] = useState<any>({})
  const [isMounted, setIsMounted] = useState(false);
  const[trxType, setTrxType]=useState('')

  useEffect(() => {
    setIsMounted(true)
    // Get application data from session
    const appData = sessionStorage.getItem('applicationData');
    const transactionStatus = sessionStorage.getItem('transaction');
    if(transactionStatus){
      setTrxType(JSON.parse(transactionStatus).type)
    }
    console.log('Transaction status is:',transactionStatus)
    if (appData) {
      const parsedData = JSON.parse(appData);
      console.log('Parsed application data:',parsedData)
      setApplicantData(parsedData)
      // Detect certificate type based on data
      if (parsedData.childFullName) {
        setCertificateType('birth-certificate')
      }
    }
  }, [])

  const printableArea = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: printableArea,
    documentTitle: `${trxType}`
  })

  const handleDownload = async () => {
    try {
      // Use the print dialog to save as PDF
      handlePrint()
      toast.info('Opening print dialog. Select "Save as PDF" to download.')
    } catch (error) {
      toast.error('Download feature is not available')
    }
  }

  const handleShare = async () => {
    const certificateText = `My ${trxType.charAt(0).toUpperCase()}${trxType.slice(1)} Certificate - Reference: ${certificateId}`
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${trxType.charAt(0).toUpperCase()}${trxType.slice(1)} Certificate`,
          text: certificateText,
          url: window.location.href,
        })
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share certificate')
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${certificateText}\n${window.location.href}`)
        toast.success('Certificate link copied to clipboard')
      } catch {
        toast.error('Share is not supported on this device')
      }
    }

    
  }

  const handleDownloadImage = async()=>{
    const link = document.createElement('a');

    const dataUrl = await htmlToImage.toPng(printableArea.current,{
      cacheBust:true,
      pixelRatio:3
    });

    link.href=dataUrl;
    link.download= `My ${trxType} Certificate.png`
    link.click()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateId)
    toast.success('Reference number copied to clipboard')
  }

  return (
    <div className="min-h-screen bg-background py-12">
        <Link href="/" className="flex items-center gap-3 w-full p-2 bg-white/20 backdrop-blur-md fixed left-0 top-0 font-bold text-xl hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
                    <img 
                      src="/coatOfArm.png" 
                      alt="Nigerian Coat of Arms" 
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="sm:inline text-gray-600">IGSL</span>
                </Link>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="mb-8 flex gap-6 md:gap-30 flex-col md:flex-row">
          <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Your Certificate</h1>
          <p className="text-foreground/70">Official government certificate for your records</p>
        </div>

        {/* Reference & Actions */}
   
    

              <div className="flex flex-wrap gap-3 ">
                <Button onClick={handlePrint}>
                  <Printer className="mr-2 w-4 h-4" />
                  Print
                </Button>
                 <Button variant="outline" onClick={handleDownloadImage}>
                  <Download className="mr-2 w-4 h-4" />
                  Download Image
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 w-4 h-4" />
                  Download PDF
                </Button>
                
               
              </div>
         
      
        </div>

        

        {/* Certificate Template */}
        <div ref={printableArea} className="bg-white p-8 rounded-lg shadow-lg mb-8 print:shadow-none">
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
