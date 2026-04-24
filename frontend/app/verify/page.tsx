'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/common/navbar'
import { Footer } from '@/components/common/footer'
import { useSearchParams } from 'next/navigation'
import { userAgent } from 'next/server'
// export const metadata: Metadata = {
//   title: 'Certificate Verification - IGSL',
//   description: 'Your certificate is official and valid. Thank you for using IGSL.',
// }

export default function VerifyPage() {
const[user,setUser] = useState(null)
  const params = useSearchParams();
  useEffect(()=>{
console.log('Params:',params)
  },[])
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative p-4 overflow-hidden">
        {/* Faint Background Coat of Arms */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/coatOfArm.png"
            alt="IGSL Coat of Arms"
            className="w-96 h-96 opacity-10"
          />
        </div>

        <div className="max-w-2xl w-full text-center relative z-10">
          {/* Certificate Icon/Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400/30 to-green-500/10 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-12 h-12 animate-pulse z-[100] text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Certificate is Official and Valid
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
            {`Belongs to ${user?.n}, issued by`}<span className='font-bold'>IGSl</span>
            </p>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-8 rounded-full"></div>

          {/* Subtitle */}
          <p className="text-lg text-gray-500 mb-12">
            Your certificate has been verified and authenticated by the IGSL Local Government Authority. It is now official and can be used for all official purposes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Go to Dashboard
            </a>
            <a
              href="/services/birth-certificate"
              className="px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
            >
              Request Another Certificate
            </a>
          </div>

          {/* Additional Info */}
          <div className="mt-16 p-8 bg-white rounded-xl shadow-md border border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Certificate Status: </span>
              <span className="text-green-600 font-medium">✓ Verified</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
