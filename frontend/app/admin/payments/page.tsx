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
import { Search, Download, MoreVertical } from 'lucide-react'
import { adminApi, formatPaymentStatus, getAdminToken } from '@/lib/api/adminApi'

type PaymentRow = {
  id: string
  source: 'payment' | 'transaction'
  referenceNumber: string
  applicantName: string
  email?: string | null
  type: string
  amount: number
  date: string
  status: string
}

export default function PaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const token = getAdminToken()
    if (!token) return

    adminApi
      .getPayments(token)
      .then((res) => {
        if (!res.success || !res.data) return

        const paymentRows: PaymentRow[] = (res.data.payments || []).map(
          (p: {
            id: string
            referenceNumber: string
            amountInKobo: string | number
            status: string
            createdAt: string
            application?: {
              applicant?: { fullName?: string; email?: string }
              serviceConfig?: { name?: string }
            }
          }) => ({
            id: p.id,
            source: 'payment' as const,
            referenceNumber: p.referenceNumber,
            applicantName: p.application?.applicant?.fullName || 'Unknown',
            email: p.application?.applicant?.email,
            type: p.application?.serviceConfig?.name || 'Application',
            amount: Number(p.amountInKobo) / 100,
            date: p.createdAt,
            status: formatPaymentStatus(p.status),
          })
        )

        const transactionRows: PaymentRow[] = (res.data.transactions || []).map(
          (t: {
            id: string
            transactionRef: string
            fullName: string
            email: string
            type: string
            amount: number
            status: string
          }) => ({
            id: t.id,
            source: 'transaction' as const,
            referenceNumber: t.transactionRef,
            applicantName: t.fullName,
            email: t.email,
            type: t.type,
            amount: t.amount,
            date: new Date().toISOString(),
            status: formatPaymentStatus(t.status),
          })
        )

        setRows([...paymentRows, ...transactionRows])
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredPayments = useMemo(() => {
    return rows.filter((payment) => {
      const matchesSearch =
        payment.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [rows, searchTerm, statusFilter])

  const stats = useMemo(() => {
    return {
      total: rows.length,
      successful: rows.filter((p) => p.status === 'successful').length,
      pending: rows.filter((p) => p.status === 'pending').length,
      failed: rows.filter((p) => p.status === 'failed').length,
      totalAmount: rows
        .filter((p) => p.status === 'successful')
        .reduce((sum, p) => sum + p.amount, 0),
    }
  }, [rows])

  if (loading) {
    return <p className="text-foreground/70">Loading payments…</p>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Payments Management</h1>
          <p className="text-foreground/70">Payment records and Flutterwave transactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Records', value: stats.total, color: 'text-blue-600' },
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
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                <Input
                  placeholder="Search by name or reference"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full" disabled>
                <Download className="mr-2 w-4 h-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Reference</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={`${payment.source}-${payment.id}`}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-primary">
                        {payment.referenceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{payment.applicantName}</p>
                          <p className="text-xs text-foreground/70">{payment.email || '—'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{payment.type}</td>
                      <td className="py-3 px-4 font-semibold">
                        NGN {payment.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 capitalize text-xs">{payment.source}</td>
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
                        <Button size="sm" variant="ghost" disabled>
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
                <p className="text-foreground/70">No payments found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
