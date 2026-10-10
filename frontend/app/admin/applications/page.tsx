'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Download, Eye } from 'lucide-react'
import {
  adminApi,
  formatPaymentStatus,
  formatVerificationStatus,
  getAdminToken,
} from '@/lib/api/adminApi'

interface AdminApplication {
  id: string
  refNumber: string
  paymentStatus: string
  verificationStatus: string
  createdAt: string
  applicant?: { fullName?: string | null; email?: string | null; phone?: string | null }
  serviceConfig?: { name?: string; serviceType?: string }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const token = getAdminToken()
    if (!token) return

    adminApi
      .getApplications(token)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setApplications(res.data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const name = app.applicant?.fullName?.toLowerCase() || ''
      const ref = app.refNumber.toLowerCase()
      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) || ref.includes(searchTerm.toLowerCase())
      const serviceType = app.serviceConfig?.serviceType || ''
      const matchesType = typeFilter === 'all' || serviceType === typeFilter
      const verification = formatVerificationStatus(app.verificationStatus)
      const matchesStatus = statusFilter === 'all' || verification === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [applications, searchTerm, typeFilter, statusFilter])

  if (loading) {
    return <p className="text-foreground/70">Loading applications…</p>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold  mb-2">Applications Management</h1>
          <p className="text-foreground/70">
            All applications from the database ({applications.length} total)
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                <Input
                  placeholder="Search by name or ref number"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IDENTIFICATION_CERTIFICATE">Local Government ID</SelectItem>
                  <SelectItem value="BIRTH_CERTIFICATE">Birth Certificate</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" disabled>
                <Download className="mr-2 w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Ref #</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Submitted</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Payment</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Verification
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const paymentLabel = formatPaymentStatus(app.paymentStatus)
                    const verificationLabel = formatVerificationStatus(app.verificationStatus)
                    return (
                      <tr
                        key={app.id}
                        className="border-b border-border hover:bg-muted/50 transition"
                      >
                        <td className="py-3 px-4 font-mono text-xs text-blue-500/80">{app.refNumber}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {app.applicant?.fullName || '—'}
                            </p>
                            <p className="text-xs text-foreground/70">
                              {app.applicant?.email || app.applicant?.phone || '—'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {app.serviceConfig?.name || app.serviceConfig?.serviceType}
                        </td>
                        <td className="py-3 px-4 text-xs">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
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
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
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
                        <td className="py-3 px-4">
                          <Button size="sm" variant="ghost" disabled title="Detail view coming soon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-foreground/70">No applications match your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
