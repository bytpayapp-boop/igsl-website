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
import { Eye, EyeOff, Lock, Mail, Shield, User } from 'lucide-react'

interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export function AdminSignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<SignupFormData> & { general?: string }>({})

  const validateForm = () => {
    const nextErrors: typeof errors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors above')
      return
    }

    setIsLoading(true)
    try {
      const result = await adminApi.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })

      localStorage.setItem(ADMIN_TOKEN_KEY, result.accessToken)
      localStorage.setItem(ADMIN_REFRESH_KEY, result.refreshToken)
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(result.admin))
      toast.success('Admin account created')
      router.replace('/admin')
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Signup failed'
      setErrors({ general: message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-primary/5 flex items-center justify-center p-4">
      <Link
        href="/"
        className="flex items-center gap-3 absolute top-8 left-8 font-bold text-xl hover:opacity-80 transition-opacity"
      >
        <div className="w-12 h-12 bg-white relative overflow-hidden rounded-full flex items-center justify-center shadow-md">
          <div className="w-20 h-20 relative flex items-center justify-center rounded">
            <img src="/coatOfArm.png" alt="Nigerian Coat of Arms" className="object-cover relative" />
          </div>
        </div>
        <span className="sm:inline text-gray-700 dark:text-gray-300">Home</span>
      </Link>

      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Admin Account</CardTitle>
          <CardDescription>
            Register an IGSL staff account to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <p className="text-sm text-destructive text-center">{errors.general}</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin-full-name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full name
              </Label>
              <Input
                id="admin-full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                className="border-gray-700/50 dark:border-gray-300/50"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="IGSL Administrator"
                disabled={isLoading}
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-signup-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input
                id="admin-signup-email"
                name="email"
                type="email"
                autoComplete="username"
                className="border-gray-700/50 dark:border-gray-300/50"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@igsl.gov.ng"
                disabled={isLoading}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-signup-password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="border-gray-700/50 dark:border-gray-300/50 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-signup-confirm" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="admin-signup-confirm"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="border-gray-700/50 dark:border-gray-300/50 pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create admin account'}
            </Button>

            <p className="text-center text-sm text-foreground/70">
              Already have an admin account?{' '}
              <Link href="/admin/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
