'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { FileText, Users, Image, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

const dashboardStats = [
  {
    title: 'Total Blog Posts',
    value: '24',
    icon: FileText,
    color: 'text-blue-500',
  },
  {
    title: 'Staff Members',
    value: '15',
    icon: Users,
    color: 'text-green-500',
  },
  {
    title: 'Gallery Items',
    value: '48',
    icon: Image,
    color: 'text-purple-500',
  },
  {
    title: 'Applications',
    value: '127',
    icon: Download,
    color: 'text-orange-500',
  },
]

const chartData = [
  { month: 'Jan', applications: 40, posts: 24 },
  { month: 'Feb', applications: 30, posts: 13 },
  { month: 'Mar', applications: 20, posts: 9 },
  { month: 'Apr', applications: 27, posts: 39 },
  { month: 'May', applications: 18, posts: 48 },
  { month: 'Jun', applications: 23, posts: 38 },
]

const activityData = [
  { time: '12:00 PM', applications: 4, posts: 2 },
  { time: '1:00 PM', applications: 3, posts: 1 },
  { time: '2:00 PM', applications: 2, posts: 3 },
  { time: '3:00 PM', applications: 5, posts: 4 },
  { time: '4:00 PM', applications: 4, posts: 2 },
  { time: '5:00 PM', applications: 6, posts: 5 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-foreground/70">
          Welcome back to the IGSL admin panel. Here&apos;s your overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/70">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Legend />
                <Bar dataKey="applications" fill="#3b82f6" />
                <Bar dataKey="posts" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="posts" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Adebayo Okafor',
                type: 'Identification',
                date: 'Today at 2:45 PM',
                status: 'Pending',
              },
              {
                name: 'Chioma Mensah',
                type: 'Birth Certificate',
                date: 'Today at 1:30 PM',
                status: 'Approved',
              },
              {
                name: 'Tunde Ayeni',
                type: 'Identification',
                date: 'Yesterday at 4:20 PM',
                status: 'Processing',
              },
              {
                name: 'Zainab Ibrahim',
                type: 'Birth Certificate',
                date: 'Yesterday at 10:15 AM',
                status: 'Completed',
              },
            ].map((app, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                <div>
                  <p className="font-medium text-primary">{app.name}</p>
                  <p className="text-sm text-foreground/70">{app.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/70">{app.date}</p>
                  <span
                    className={`inline-block text-xs font-medium mt-1 px-2 py-1 rounded-full ${
                      app.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : app.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button>Create New Post</Button>
        <Button variant="outline">View All Applications</Button>
        <Button variant="outline">Export Report</Button>
      </div>
    </div>
  )
}
