'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  ArrowRight,
  User,
  Settings,
  Briefcase,
  FileCheck,
} from 'lucide-react'
import { dashboardApi } from '@/lib/api/dashboardApi'

interface Application {
  id: string
  type: 'birth-certificate' | 'identification' | string
  status: 'pending' | 'verified' | 'rejected' | 'completed' | string
  submissionDate: string
  completionDate?: string
  referenceNumber: string
  applicantName?: string
}

interface UserData {
  id: string
  name: string
  email: string
  role: string
}

// Mock recent documents data - fallback
const mockDocuments: Application[] = [
  {
    id: '1',
    type: 'birth-certificate',
    status: 'completed',
    submissionDate: '2024-03-01',
    completionDate: '2024-03-15',
    referenceNumber: 'BC-2024-001234',
  },
  {
    id: '2',
    type: 'identification',
    status: 'verified',
    submissionDate: '2024-03-10',
    completionDate: '2024-03-18',
    referenceNumber: 'ID-2024-005678',
  },
  {
    id: '3',
    type: 'birth-certificate',
    status: 'pending',
    submissionDate: '2024-03-20',
    referenceNumber: 'BC-2024-009012',
  },
]

const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || ''
  if (normalizedStatus.includes('completed') || normalizedStatus.includes('issued')) {
    return 'bg-green-100 text-green-800'
  }
  if (normalizedStatus.includes('verified') || normalizedStatus.includes('approved')) {
    return 'bg-blue-100 text-blue-800'
  }
  if (normalizedStatus.includes('pending') || normalizedStatus.includes('review')) {
    return 'bg-yellow-100 text-yellow-800'
  }
  if (normalizedStatus.includes('rejected')) {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-gray-100 text-gray-800'
}

const getStatusIcon = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || ''
  if (normalizedStatus.includes('completed') || normalizedStatus.includes('issued')) {
    return <CheckCircle className="w-4 h-4" />
  }
  if (normalizedStatus.includes('verified') || normalizedStatus.includes('approved')) {
    return <CheckCircle className="w-4 h-4" />
  }
  if (normalizedStatus.includes('pending') || normalizedStatus.includes('review')) {
    return <Clock className="w-4 h-4" />
  }
  if (normalizedStatus.includes('rejected')) {
    return <AlertCircle className="w-4 h-4" />
  }
  return null
}

const services = [
  {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    description: 'Apply for or renew your birth certificate',
    icon: FileCheck,
    href: '/services/birth-certificate',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'identification',
    name: 'Local Government ID',
    description: 'Get your official local government identification',
    icon: Briefcase,
    href: '/services/identification',
    color: 'from-purple-500 to-purple-600',
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [documents, setDocuments] = useState<Application[]>(mockDocuments)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('User is:',parsedUser)
      setUser(parsedUser)

      // Fetch applications from API
      fetchApplications(token)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      router.push('/auth/login')
    }
  }, [router])

  const fetchApplications = async (token: string) => {
    try {
      setIsLoading(true)
      const response = await dashboardApi.getApplications(token)
      
      if (response && response.data && Array.isArray(response.data)) {
        // Transform API response to match our interface
        const transformedData = response.data.map((app: any) => ({
          id: app.id,
          type: app.applicationType || 'identification',
          status: app.applicationStatus || app.status || 'pending',
          submissionDate: app.createdAt || app.submissionDate,
          completionDate: app.completedAt || app.approvedAt,
          referenceNumber: app.referenceNumber || `APP-${app.id?.substring(0, 8)}`,
          applicantName: app.applicantName,
        }))
        setDocuments(transformedData)
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err)
      setError(err.message)
      // Keep using mock data as fallback
      setDocuments(mockDocuments)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const pendingCount = documents.filter((doc) => 
    doc.status.toLowerCase().includes('pending') || 
    doc.status.toLowerCase().includes('review')
  ).length
  const completedCount = documents.filter((doc) =>
    doc.status.toLowerCase().includes('completed') ||
    doc.status.toLowerCase().includes('verified') ||
    doc.status.toLowerCase().includes('approved') ||
    doc.status.toLowerCase().includes('issued')
  ).length

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-primary dark:bg-gray-900 rounded-2xl p-8 text-white shadow-lg border border-primary/20 dark:border-primary/40">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-primary mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Welcome back
                </p>
                <h2 className="text-4xl text-gray-800 dark:text-gray-200 font-bold mb-2">{user.fullName}</h2>
                <p className="text-gray-600  dark:text-gray-300 text-lg">Manage your applications and generate verifiable documents</p>
              </div>
              <div className="text-right">
                <div className="text-5xl text-gray-600 dark:text-gray-400 font-bold">{documents.length}</div>
                <p className="text-primary">Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary dark:text-primary/90" />
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{documents.length}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">submissions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary dark:text-primary/90" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{completedCount}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">approved</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary dark:text-secondary/80" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{pendingCount}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">in progress</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Services</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Start a new application or access available services</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.id} href={service.href}>
                  <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-primary dark:bg-primary/80 text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.name}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{service.description}</p>
                      <div className="mt-4 flex items-center text-primary font-medium text-sm">
                        Start Here <Plus className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Applications</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track the status of your submitted documents</p>
            </div>
            <Link href="/dashboard/applications">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800">
                <CardContent className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading applications...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <p className="text-yellow-800">Unable to load real applications. Showing sample data.</p>
                </CardContent>
              </Card>
            ) : null}

            {documents.length > 0 ? (
              documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-primary/20 dark:border-primary/30">
                        <FileText className="w-6 h-6 text-primary dark:text-primary/90" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white capitalize truncate">
                            {doc.type === 'birth-certificate' ? 'Birth Certificate' : 'Local Government ID'}
                          </h4>
                          <Badge className={`${getStatusColor(doc.status)} border-0 flex items-center gap-1 flex-shrink-0`}>
                            {getStatusIcon(doc.status)}
                            <span className="capitalize text-xs">{doc.status}</span>
                          </Badge>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 text-sm text-gray-600 dark:text-gray-400 mt-2 flex-wrap">
                          <span className="truncate font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Ref: {doc.referenceNumber}</span>
                          <span>Submitted: {new Date(doc.submissionDate).toLocaleDateString()}</span>
                          {doc.completionDate && (
                            <span>Completed: {new Date(doc.completionDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                     
                      {(doc.status.toLowerCase().includes('completed') || 
                        doc.status.toLowerCase().includes('verified') ||
                        doc.status.toLowerCase().includes('approved') ||
                        doc.status.toLowerCase().includes('issued')) && (
                        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                           <Eye className="w-4 h-4" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No applications yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                    Start by applying for a service below to begin the process
                  </p>
                  <Link href="/services">
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Browse Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary dark:text-primary/90" />
                Need Help?
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Get support for your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Contact our support team if you have questions about your applications or need assistance with the process.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-accent dark:text-accent/80" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Update your personal information and adjust your account preferences and notification settings.
              </p>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
