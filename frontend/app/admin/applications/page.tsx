'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockApplications } from '@/lib/mock-data'
import { Search, Download, Eye } from 'lucide-react'

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredApplications = useMemo(() => {
    return mockApplications.filter((app) => {
      const matchesSearch =
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !typeFilter || app.type === typeFilter
      const matchesStatus = !statusFilter || app.verificationStatus === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, typeFilter, statusFilter])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Applications Management</h1>
          <p className="text-foreground/70">
            Manage and track all user applications and their status
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                <Input
                  placeholder="Search by name or app number"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="identification">Local Government ID</SelectItem>
                  <SelectItem value="birth-certificate">Birth Certificate</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button variant="outline">
                <Download className="mr-2 w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              All Applications ({filteredApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Application #
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Applicant
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Submission Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Payment
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Verification
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-primary">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {app.applicantName}
                          </p>
                          <p className="text-xs text-foreground/70">{app.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {app.type === 'identification'
                          ? 'Local Govt ID'
                          : 'Birth Certificate'}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {new Date(app.submissionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
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
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
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
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-foreground/70">
                  No applications found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
