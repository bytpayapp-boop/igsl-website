'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, User, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  role: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<UserData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'user',
  })

  const [originalData, setOriginalData] = useState<UserData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'user',
  })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    try {
      const user = JSON.parse(userData)
      setFormData(user)
      setOriginalData(user)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      router.push('/auth/login')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Here you would make an API call to update user data
      // For now, we'll just update localStorage and show a success message
      localStorage.setItem('user', JSON.stringify(formData))
      setOriginalData(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Header */}
      <div className="border-b-2 border-primary dark:border-primary/50 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your profile information</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information Section */}
          <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary dark:text-primary/90" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">This is your public display name</p>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll use this for important notifications</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="+234 (0) 800 000 0000"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: We may use this to contact you about your applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status Section */}
          <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-primary/20 dark:border-primary/30">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Account ID:</span> {formData.id}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-semibold">Status:</span> <span className="text-primary dark:text-primary/90 font-semibold">Active</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-semibold">Role:</span> <span className="capitalize text-gray-700 dark:text-gray-300">{formData.role}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="outline" className="w-full">
                Change Password
              </Button>
              <p className="text-xs text-gray-500">Change your password regularly to keep your account secure</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={!hasChanges || isSaving}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        {/* Danger Zone */}
        <Card className="border border-accent/30 dark:border-accent/40 bg-white dark:bg-gray-800 shadow-sm mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-accent dark:text-accent/80 font-bold">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Deleting your account is permanent and cannot be undone. All your data and applications will be deleted.
            </p>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
