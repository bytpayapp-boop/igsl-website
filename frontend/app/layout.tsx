import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/common/navbar'
import { Footer } from '@/components/common/footer'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'IGSL Local Government',
  description: 'Official website of Igbo-Eze South LGA - Services, Information, and Citizen Engagement',
  generator: 'Ezeh Mark',
  metadataBase: new URL('https://igsl.vercel.app'),
  alternates: {
    canonical: 'https://igsl.vercel.app',
  },
  keywords: [
    'IGSL Local Government',
    'Igbo-Eze South',
    'Local Government Services',
    'Birth Certificate',
    'Government ID',
    'Citizen Portal',
    'Enugu State',
  ],
  authors: [{ name: 'Ezeh Mark' }],
  creator: 'Ezeh Mark',
  publisher: 'IGSL Local Government',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'IGSL Local Government - Services & Citizen Engagement',
    description: 'Official portal of IGSL Local Government - Services, Information, and Citizen Engagement',
    url: 'https://igsl.vercel.app',
    siteName: 'IGSL Local Government',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IGSL Local Government Portal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Igbo-Eze South LGA - Services & Citizen Engagement',
    description: 'Official portal of IGSL Local Government - Services, Information, and Citizen Engagement',
    images: ['/og-image.png'],
  },
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en"
      className='bg-white'
      style={{scrollbarWidth:'thin'}}
      suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Canonical URL */}
        <link rel="canonical" href="https://igsl.vercel.app" />
      </head>
      <body className="font-sans antialiased flex flex-col  min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-1">
             {/* <Link href="/" className="flex items-center gap-3 font-bold top-5 left-5 text-xl md:top-5 md:left-10 absolute  md:block md:flex hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
              <img 
                src="/coatOfArm.png" 
                alt="Nigerian Coat of Arms" 
                className="w-10 h-10"
              />
            </div>
            <span className="sm:inline text-gray-700 dark:text-gray-300">IGSL</span>
          </Link> */}
            {children}
          </main>
          <Analytics />
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
