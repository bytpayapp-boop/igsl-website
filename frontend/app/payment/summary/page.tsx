'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const FEES = {
  identification: 5000,
  'birth-certificate': 3500,
}

function PaymentSummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'identification'
  const [isProcessing, setIsProcessing] = useState(false)
  const [accepted, setAccepted] = useState(false);
  const[amount,setAmout]=useState(4000);
  const[Loading,setLoading]=useState(false);
  const[queryTrxStatus,setQueryTrxStatus]=useState(false);
  const[token,setToken]=useState('')

  const [polling,setPolling]=useState(false)
  const[user,setUser]=useState(null)

 const applicationData = typeof window !== 'undefined' ? 
    JSON.parse(sessionStorage.getItem('applicationData') || '{}') : 
    {};

    //polling handler:

    const handlePoll =async()=>{
const response = await axios.get(`https://igsl-website.onrender.com/query/status/${user.email}`,
  {headers:{'Authorization':`Bearer ${token}`}}
);

if (response.data.msg=='success'){
  router.push('/success');
}

}
  useEffect(()=>{
const storedToken = sessionStorage.getItem('token');
setToken(token)
console.log('the token for this transaction user is:',token)
setToken(storedToken || '');
const userData = sessionStorage.getItem('user')
    if(userData){
      const user = JSON.parse(userData);
      setUser(user)

    console.log('The user submitting application is:',user);
  }

    console.log('Application data:',applicationData)




let interval;
if(polling){
interval = setInterval(()=>{
  handlePoll()
},4000)
}

else{
  clearInterval(interval)
}
   
    
  },[polling]);

  // const amount = FEES[type as keyof typeof FEES] || 5000
  const typeName = type === 'identification' ? 'Local Government ID' : 'Birth Certificate'

  const handlePayment = async () => {
    if (!accepted) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsProcessing(true)
    if(user){
    try {

      FlutterwaveCheckout({
      public_key: "FLWPUBK-4fddaba321d47611adb08ce8098c9670-X",
      amount: amount,
      currency: "NGN",
      tx_ref: `Flutterwave_${'ezeh@gmail.com'}_${JSON.stringify(applicationData)}`,
      payment_options: "banktransfer,ussd",
      customer: {
        email: user?.email,
        phone_number: user?.phone,
        name: user?.fullName,
      },
      customizations: {
        title: `BytPay Funding - Ezeh Mark`, //${user?.fullName.split(" ")[0]}
        description: "The Fastest Way to Fund Your Wallet Automatically",
        logo: "/coatOfArm.png",
      },
      callback: (res) => {
        if (typeof (window as any).closePaymentModal === "function")
          window.closePaymentModal(); 
      },
      onClose: () => {
        setLoading(false);

      },
    });
      
    setTimeout(()=>router.push('/success'),2000)
      // Randomly succeed or fail for demo purposes (90% success rate)
     
    } catch (error) {
      toast.error('Payment processing failed')
      setIsProcessing(false)
    }
  }

   setTimeout(()=>router.push('/success'),2000)
      // Randomly succeed or fail for demo purposes (90% success rate)

  }

  return (
    <div className="min-h-screen bg-background py-12">
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        strategy="afterInteractive"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">Payment Summary</h1>
          <p className="text-primary">Review and confirm your payment details</p>
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
                <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
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
            <div className="bg-gray-200 dark:bg-gray-700 border border-blue-200 p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-foreground dark:text-gray-300">
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
          <div className='flex gap-2'><ShieldCheck className='text-green-500'/> 
          <div>Your payment is secure and encrypted</div>
          </div>
          <p className="mt-2">Payment is processed through Flutterwave Payment Gateway</p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSummaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <PaymentSummaryContent />
    </Suspense>
  )
}
