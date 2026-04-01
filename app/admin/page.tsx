'use client'

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
import { mockDashboardStats, mockApplications, mockPayments } from '@/lib/mock-data'

export default function AdminDashboard() {
  const stats = mockDashboardStats

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-foreground/70">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
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

        {/* Recent Activities & Applications */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'application' && (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                      {activity.type === 'payment' && (
                        <CreditCard className="w-5 h-5 text-primary" />
                      )}
                      {activity.type === 'blog' && (
                        <TrendingUp className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        {activity.description}
                      </p>
                      <p className="text-xs text-foreground/70 mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <FileText className="mr-2 w-4 h-4" />
                  View All Applications
                </Button>
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <CreditCard className="mr-2 w-4 h-4" />
                  View Pending Payments
                </Button>
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <Users className="mr-2 w-4 h-4" />
                  Manage Staff
                </Button>
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <TrendingUp className="mr-2 w-4 h-4" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Applicant
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Payment Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Verification
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockApplications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{app.applicantName}</td>
                      <td className="py-3 px-4 capitalize">
                        {app.type === 'identification'
                          ? 'Local Government ID'
                          : 'Birth Certificate'}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(app.submissionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            app.paymentStatus === 'successful'
                              ? 'bg-green-100 text-green-800'
                              : app.paymentStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            app.verificationStatus === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : app.verificationStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {app.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
