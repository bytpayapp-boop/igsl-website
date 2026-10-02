'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  adminApi,
  formatPaymentStatus,
  formatVerificationStatus,
  getAdminToken,
} from '@/lib/api/adminApi'

interface DashboardStats {
  totalApplications: number
  pendingPayments: number
  successfulPayments: number
  staffCount: number
  recentActivities: {
    id: string
    type: string
    description: string
    timestamp: string
  }[]
  recentApplications: {
    id: string
    refNumber: string
    paymentStatus: string
    verificationStatus: string
    createdAt: string
    applicant?: { fullName?: string | null; email?: string | null }
    serviceConfig?: { name?: string; serviceType?: string }
  }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getAdminToken()
    if (!token) return

    adminApi
      .getDashboardStats(token)
      .then((res) => {
        if (res.success) setStats(res.data)
        else setError('Could not load dashboard data')
      })
      .catch(() => setError('Failed to load dashboard from server'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-foreground/70">Loading dashboard…</p>
  }

  if (error || !stats) {
    return <p className="text-destructive">{error || 'No data available'}</p>
  }

  return (
    <div className="min-h-screen bg-background p-2 md:p-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-foreground/70">Live overview from the IGSL backend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Applications',
              value: stats.totalApplications,
              icon: FileText,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50',
            },
            {
              title: 'Pending Payments',
              value: stats.pendingPayments,
              icon: Clock,
              color: 'text-orange-600',
              bgColor: 'bg-orange-50',
            },
            {
              title: 'Successful Payments',
              value: stats.successfulPayments,
              icon: CheckCircle2,
              color: 'text-green-600',
              bgColor: 'bg-green-50',
            },
            {
              title: 'Total Staff',
              value: stats.staffCount,
              icon: Users,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50',
            },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivities.length === 0 ? (
                  <p className="text-sm text-foreground/70">No recent activity yet.</p>
                ) : (
                  stats.recentActivities.map((activity) => (
                    <div
                      key={`${activity.type}-${activity.id}`}
                      className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {activity.type === 'application' && (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                        {activity.type === 'payment' && (
                          <CreditCard className="w-5 h-5 text-primary" />
                        )}
                        {activity.type !== 'application' && activity.type !== 'payment' && (
                          <TrendingUp className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{activity.description}</p>
                        <p className="text-xs text-foreground/70 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" size="lg" variant="outline" asChild>
                  <Link href="/admin/applications">
                    <FileText className="mr-2 w-4 h-4" />
                    View All Applications
                  </Link>
                </Button>
                <Button className="w-full justify-start" size="lg" variant="outline" asChild>
                  <Link href="/admin/payments">
                    <CreditCard className="mr-2 w-4 h-4" />
                    View Payments
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Payment Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Verification
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentApplications.map((app) => {
                    const paymentLabel = formatPaymentStatus(app.paymentStatus)
                    const verificationLabel = formatVerificationStatus(app.verificationStatus)
                    return (
                      <tr key={app.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          {app.applicant?.fullName || 'Unknown'}
                        </td>
                        <td className="py-3 px-4">
                          {app.serviceConfig?.name || app.serviceConfig?.serviceType || '—'}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              paymentLabel === 'successful'
                                ? 'bg-green-100 text-green-800'
                                : paymentLabel === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {paymentLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              verificationLabel === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : verificationLabel === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {verificationLabel}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
