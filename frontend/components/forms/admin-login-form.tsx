'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  adminApi,
  ADMIN_REFRESH_KEY,
  ADMIN_TOKEN_KEY,
  ADMIN_USER_KEY,
} from '@/lib/api/adminApi'
import { Shield } from 'lucide-react'

export function AdminLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>(
    {}
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!formData.email.trim()) nextErrors.email = 'Email is required'
    if (!formData.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      const result = await adminApi.login(formData.email.trim(), formData.password)
      localStorage.setItem(ADMIN_TOKEN_KEY, result.accessToken)
      localStorage.setItem(ADMIN_REFRESH_KEY, result.refreshToken)
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(result.admin))
      toast.success('Admin login successful')
      router.replace('/admin')
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Login failed'
      setErrors({ general: message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-primary/5 flex items-center justify-center p-4">
       <Link href="/" className="flex items-center gap-3 absolute top-8 left-8 font-bold text-xl hover:opacity-80 transition-opacity">
           <div className="w-12 h-12 bg-white relative overflow-hidden rounded-full flex items-center justify-center shadow-md">
            <div className="w-20 h-20 relative flex items-center justify-center rounded">
              <img 
                src="/coatOfArm.png" 
                alt="Nigerian Coat of Arms" 
                className="object-cover relative"
              />
            </div>
            </div>
            
            <span className="sm:inline text-gray-700 dark:text-gray-300">Home</span>
          </Link>
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Authorized IGSL staff only. This is separate from citizen login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <p className="text-sm text-destructive text-center">{errors.general}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                className='border-gray-700/50 dark:border-gray-300/50'
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@igsl.gov.ng"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                className='border-gray-700/50 dark:border-gray-300/50'
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
            <p className="text-center text-sm text-foreground/70">
              <Link href="/" className="text-primary hover:underline">
                Back to Home
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
