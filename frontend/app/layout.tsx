import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/common/navbar'
import { Footer } from '@/components/common/footer'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'IGSL Local Government',
  description: 'Official portal of IGSL Local Government - Services, Information, and Citizen Engagement',
  generator: 'Ezeh Mark',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'IGSL Local Government',
    description: 'Official portal of IGSL Local Government - Services, Information, and Citizen Engagement',
    url: 'https://igsl.gov.ng',
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
      <body className="font-sans antialiased flex flex-col  min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-1">
            {children}
          </main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
