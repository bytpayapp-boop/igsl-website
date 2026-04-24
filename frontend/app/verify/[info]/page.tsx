'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/common/navbar'
import { Footer } from '@/components/common/footer'
import dayjs from 'dayjs'

export const dynamic = 'force-dynamic'

function VerifyContent() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const params = useParams()

  useEffect(() => {
    try {
        console.log('Params:',params)
      if (params.info) {
        // Decode the URL-encoded base64 string, then decode the base64
        const decodedBase64 = decodeURIComponent(params.info as string)
        const decoded = atob(decodedBase64)
        
        const data = JSON.parse(decoded)
        setUser(data)
      }
    } catch (err) {
      setError('Invalid certificate data')
      console.error('Failed to decode certificate data:', err)
    }
  }, [params.info])

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
          {error ? (
            <>
              <div className="mb-8 flex justify-center">
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-400/30 to-red-500/10 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-12 h-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                Certificate Not Found
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-medium mt-4">
                {error}
              </p>
            </>
          ) : user ? (
            <>
              {/* Certificate Icon/Badge */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-400/10 to-green-500/10 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
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
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  Certificate is Official and Valid
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 font-medium">
                  Belongs to <span className="font-bold">{user.n}</span>, issued by <span className="font-bold">IGSL</span>
                </p>
                {user.w && (
                  <p className="text-lg text-gray-500">
                    Ward: <span className="font-semibold text-gray-700">{user.w}</span>
                  </p>
                )}
                {user.d && (
                  <p className="text-lg text-gray-500">
                    Issue Date: <span className="font-semibold text-gray-700">{dayjs(user.d).format('DD MMMM, YYYY hh:mm A')}</span>
                  </p>
                )}
              </div>

              {/* Decorative Line */}
              <div className="w-24 h-[2px] bg-gradient-to-r from-gray-600 via-gray-400/50 to-gray-500 mx-auto mb-8 rounded-full"></div>

              {/* Subtitle */}
              <p className="text-lg text-gray-500 mb-12">
                Your certificate has been verified and authenticated by the IGSL Local Government Authority. It is valid and can be used for all official purposes.
              </p>

              {/* Action Buttons
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
              </div> */}

              {/* Additional Info */}
              <div className="mt-16 p-8 bg-white rounded-xl shadow-md border border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Certificate Status: </span>
                  <span className="text-green-600 font-medium">✓ Verified</span>
                </p>
              </div>
            </>
          ) : (
           <div className='p-4 py-20 flex items-center justify-center'>Verifying <div className='h-4 w-4 ml-6 rounded-full border-[4px] border-green-600/80 animate-spin'/></div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function VerifyInfoPage() {
  return (
    <Suspense fallback={<div className='p-4 py-20 flex items-center justify-center'>Verifying <div className='h-4 w-4 ml-6 rounded-full border-[4px] border-green-600/80 animate-spin'/></div>}>
      <VerifyContent />
    </Suspense>
  )
}
