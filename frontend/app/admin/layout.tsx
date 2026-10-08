'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileText,
  Users,
  Image,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import {
  adminApi,
  clearAdminSession,
  getAdminToken,
  ADMIN_USER_KEY,
} from '@/lib/api/adminApi'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: FileText },
  { href: '/admin/payments', label: 'Payments', icon: FileText },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/archive', label: 'Archive', icon: FileText },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/staff', label: 'Staff Directory', icon: Users },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authReady, setAuthReady] = useState(false)
  const [adminName, setAdminName] = useState<string | null>(null)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setAuthReady(true)
      return
    }

    const token = getAdminToken()
    if (!token) {
      router.replace('/admin/login')
      return
    }

    const stored = localStorage.getItem(ADMIN_USER_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAdminName(parsed.fullName || parsed.email)
      } catch {
        setAdminName(null)
      }
    }

    adminApi
      .getMe(token)
      .then(() => setAuthReady(true))
      .catch(() => {
        clearAdminSession()
        router.replace('/admin/login')
      })
  }, [isLoginPage, pathname, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Verifying admin session…</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="border border-border"
        >
          {!sidebarOpen && <Menu className="w-4 h-4" />}
        </Button>
      </div>

      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20 md:w-64'
        } ${sidebarOpen ? 'fixed md:relative' : 'hidden md:flex'} md:flex md:flex-col md:w-64 border-r border-border bg-background backdrop-blur-md transition-all pt-6 duration-300 flex flex-col h-screen md:h-auto z-40`}
      >
        <div className="p-0 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
             
          <Link href="/" className="flex items-center gap-3 font-bold text-xl hover:opacity-80 ml-4 transition-opacity">
           <div className="w-12 h-12 bg-white relative overflow-hidden rounded-full flex items-center justify-center shadow-md">
            <div className="w-20 h-20 relative flex items-center justify-center rounded">
              <img 
                src="/coatOfArm.png" 
                alt="Nigerian Coat of Arms" 
                className="object-cover relative"
              />
            </div>
            </div>
            
            <span className="sm:inline text-gray-700 dark:text-gray-300">IGSL</span>
          </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block"
          >
           {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {sidebarOpen && adminName && (
          <p className="px-6 py-2 text-xs text-foreground/60 truncate">{adminName}</p>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
            onClick={() => {
              clearAdminSession()
              router.push('/admin/login')
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto md:pl-0 pl-0 pt-16 md:pt-0">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
