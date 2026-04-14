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
    icon: [
      {
        url: '/coatOfArm.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/coatOfArm.png',
        media: '(prefers-color-scheme: dark)',
      },
      // {
      //   url: '/icon.svg',
      //   type: 'image/svg+xml',
      // },
    ],
    apple: '/apple-icon.png',
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
