'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Eye,
  Download,
  Trash2,
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

// Mock data - fallback
const mockApplications: Application[] = [
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
  {
    id: '4',
    type: 'identification',
    status: 'rejected',
    submissionDate: '2024-02-15',
    referenceNumber: 'ID-2024-000123',
  },
]

const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || ''
  if (normalizedStatus.includes('completed') || normalizedStatus.includes('issued')) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
  }
  if (normalizedStatus.includes('verified') || normalizedStatus.includes('approved')) {
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
  }
  if (normalizedStatus.includes('pending') || normalizedStatus.includes('review')) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
  }
  if (normalizedStatus.includes('rejected')) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  }
  return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
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

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // Fetch applications from API
    fetchApplications(token)
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
        setApplications(transformedData)
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err)
      setError(err.message)
      // Keep using mock data as fallback
      setApplications(mockApplications)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredApplications =
    filterStatus === 'all'
      ? applications
      : applications.filter((app) => {
          const normalizedStatus = app.status.toLowerCase()
          const normalizedFilter = filterStatus.toLowerCase()
          if (normalizedFilter === 'pending') {
            return normalizedStatus.includes('pending') || normalizedStatus.includes('review')
          }
          return normalizedStatus.includes(normalizedFilter)
        })

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Header */}
      <div className="border-b-2 border-primary dark:border-primary/50 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all your submitted applications</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <Card className="border border-secondary/30 dark:border-secondary/40 bg-secondary/10 dark:bg-secondary/20 mb-6">
            <CardContent className="p-4">
              <p className="text-secondary dark:text-secondary/90 text-sm font-medium">Note: Displaying sample data</p>
            </CardContent>
          </Card>
        )}

        <div className="mb-8 flex flex-wrap gap-3">
          {['all', 'pending', 'verified', 'completed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                filterStatus === status
                  ? 'bg-primary dark:bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/40'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs opacity-75">
                ({applications.filter((app) => {
                  if (status === 'all') return true
                  const normalizedStatus = app.status.toLowerCase()
                  const normalizedFilter = status.toLowerCase()
                  if (normalizedFilter === 'pending') {
                    return normalizedStatus.includes('pending') || normalizedStatus.includes('review')
                  }
                  return normalizedStatus.includes(normalizedFilter)
                }).length})
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-primary/80 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading applications...</p>
            </CardContent>
          </Card>
        )}

        {/* Applications List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <Card
                  key={app.id}
                  className="border border-primary/10 dark:border-primary/20 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-primary/20 dark:border-primary/30 flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary dark:text-primary/90" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 dark:text-white capitalize truncate">
                              {app.type === 'birth-certificate'
                                ? 'Birth Certificate Application'
                                : 'Local Government ID Application'}
                            </h3>
                            <Badge
                              className={`${getStatusColor(
                                app.status
                              )} border-0 flex items-center gap-1 flex-shrink-0`}
                            >
                              {getStatusIcon(app.status)}
                              <span className="capitalize text-xs">{app.status}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reference</p>
                              <p className="font-mono text-gray-900 dark:text-white truncate">{app.referenceNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Submitted</p>
                              <p className="text-gray-900 dark:text-white">{new Date(app.submissionDate).toLocaleDateString()}</p>
                            </div>
                            {app.completionDate && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Completed</p>
                                <p className="text-gray-900 dark:text-white">
                                  {new Date(app.completionDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</p>
                              <p className="text-gray-900 dark:text-white capitalize">
                                {app.type === 'birth-certificate' ? 'Birth Cert.' : 'ID'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        {(app.status.toLowerCase().includes('completed') ||
                          app.status.toLowerCase().includes('verified') ||
                          app.status.toLowerCase().includes('approved') ||
                          app.status.toLowerCase().includes('issued')) && (
                          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        )}
                        {app.status.toLowerCase().includes('pending') && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-accent dark:text-accent/90 hover:text-accent dark:hover:text-accent hover:bg-accent/10 dark:hover:bg-accent/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Cancel</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border border-primary/20 dark:border-primary/30 bg-white dark:bg-gray-800">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">No applications found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                    {filterStatus === 'all'
                      ? 'You haven\'t submitted any applications yet.'
                      : `You don't have any ${filterStatus} applications.`}
                  </p>
                  <Link href="/services">
                    <Button className="gap-2">Start a New Application</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
