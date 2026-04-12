'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockPayments } from '@/lib/mock-data'
import { Search, Download, MoreVertical } from 'lucide-react'

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredPayments = useMemo(() => {
    return mockPayments.filter((payment) => {
      const matchesSearch =
        payment.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || payment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const stats = {
    total: mockPayments.length,
    successful: mockPayments.filter((p) => p.status === 'successful').length,
    pending: mockPayments.filter((p) => p.status === 'pending').length,
    failed: mockPayments.filter((p) => p.status === 'failed').length,
    totalAmount: mockPayments
      .filter((p) => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Payments Management</h1>
          <p className="text-foreground/70">
            Monitor and manage all payment transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Payments', value: stats.total, color: 'text-blue-600' },
            { label: 'Successful', value: stats.successful, color: 'text-green-600' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Failed', value: stats.failed, color: 'text-red-600' },
            {
              label: 'Total Revenue',
              value: `NGN ${stats.totalAmount.toLocaleString()}`,
              color: 'text-primary',
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/70 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                <Input
                  placeholder="Search by name or reference"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button variant="outline" className="w-full">
                <Download className="mr-2 w-4 h-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              All Payments ({filteredPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Reference
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Applicant
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-primary">
                        {payment.referenceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {payment.applicantName}
                          </p>
                          <p className="text-xs text-foreground/70">
                            {payment.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {payment.type === 'identification'
                          ? 'Local Govt ID'
                          : 'Birth Certificate'}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        NGN {payment.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            payment.status === 'successful'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-foreground/70">
                  No payments found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
