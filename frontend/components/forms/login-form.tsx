'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, ShieldCheck, Lock, UserCheck } from 'lucide-react'

const BACKEND_URL = 'https://igsl-website.onrender.com'

interface LoginFormData {
  username: string
  password: string
}

interface LoginErrors {
  username?: string
  password?: string
  general?: string
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  })

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Call backend Express server directly with axios
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        username: formData.username,
        password: formData.password,
      });

   console.log(response.data)

      const { accessToken, user, refreshToken } = response.data

      // Store token and user in localStorage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('refreshToken',refreshToken)

      toast.success('Login successful! Redirecting...')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      setErrors({ general: message })
      toast.error(message)
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="space-y-2  border-b">
          <CardTitle className="text-2xl font-bold  text-gray-700 flex items-center gap-2">
            <UserCheck className="w-6 h-6" />
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error Message */}
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <p className="text-sm text-destructive font-medium">{errors.general}</p>
              </div>
            )}

            {/* Username/Email Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username or Email
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={handleInputChange}
                className={`transition ${
                  errors.username
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'border-primary/20 focus-visible:ring-primary'
                }`}
                disabled={isLoading}
                autoComplete="username"
              />
              {errors.username && (
                <p className="text-xs text-destructive font-medium">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`transition pr-10 ${
                    errors.password
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'border-primary/20 focus-visible:ring-primary'
                  }`}
                  disabled={isLoading}
                  autoComplete="current-password"
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
              {errors.password && (
                <p className="text-xs text-destructive font-medium">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-2 h-auto mt-6 transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Security Infoarea */}
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 items-center justify-center rounded-lg">
              <p className="text-xs text-foreground/70 flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5"><ShieldCheck className='text-green-600'/></span>
                Your login credentials are encrypted and secure
              </p>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                Create one now
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
