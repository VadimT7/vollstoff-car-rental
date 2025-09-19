'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Calendar
} from 'lucide-react'
import { Button, Card, Input } from '@valore/ui'
import { format } from 'date-fns'
import { exportToCSV, type ExportColumn, formatters } from '@/lib/export-utils'

interface Payment {
  id: string
  bookingNumber: string
  customerName: string
  customerEmail?: string
  amount: number
  currency: string
  type: 'DEPOSIT' | 'RENTAL_FEE' | 'EXTRA_CHARGE' | 'REFUND' | 'DAMAGE_CHARGE'
  method: 'CARD' | 'CASH' | 'BANK_TRANSFER'
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED'
  stripePaymentIntentId?: string
  stripeChargeId?: string
  createdAt: Date
  processedAt?: Date
}

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  PROCESSING: { label: 'Processing', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50' },
  SUCCEEDED: { label: 'Succeeded', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  FAILED: { label: 'Failed', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-50' }
}

const typeConfig = {
  DEPOSIT: { label: 'Deposit', icon: DollarSign, color: 'text-blue-600' },
  RENTAL_FEE: { label: 'Rental Fee', icon: DollarSign, color: 'text-green-600' },
  EXTRA_CHARGE: { label: 'Extra Charge', icon: ArrowDownLeft, color: 'text-yellow-600' },
  REFUND: { label: 'Refund', icon: ArrowUpRight, color: 'text-red-600' },
  DAMAGE_CHARGE: { label: 'Damage Charge', icon: XCircle, color: 'text-red-600' }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [dateRange])

  const fetchPayments = async () => {
    try {
      console.log('💳 Fetching payments from API...')
      const response = await fetch('/api/payments')
      if (response.ok) {
        const apiPayments = await response.json()
        console.log('✅ Payments fetched:', apiPayments.length)
        setPayments(apiPayments)
      } else {
        console.error('❌ Failed to fetch payments:', response.status)
        setPayments([])
      }
    } catch (error) {
      console.error('❌ Error fetching payments:', error)
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const columns: ExportColumn[] = [
      { key: 'bookingNumber', label: 'Booking Number' },
      { key: 'customerName', label: 'Customer Name' },
      { key: 'amount', label: 'Amount', format: formatters.currency },
      { key: 'currency', label: 'Currency' },
      { key: 'type', label: 'Type', format: formatters.status },
      { key: 'method', label: 'Payment Method', format: formatters.status },
      { key: 'status', label: 'Status', format: formatters.status },
      { key: 'stripePaymentIntentId', label: 'Stripe Payment ID' },
      { key: 'createdAt', label: 'Created Date', format: formatters.datetime },
      { key: 'processedAt', label: 'Processed Date', format: formatters.datetime }
    ]
    
    exportToCSV(payments, columns, 'payments')
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.stripePaymentIntentId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesType = filterType === 'all' || payment.type === filterType
    
    // Date filter
    const paymentDate = new Date(payment.createdAt)
    const matchesDateRange = (!dateRange.start || paymentDate >= new Date(dateRange.start)) &&
                            (!dateRange.end || paymentDate <= new Date(dateRange.end + 'T23:59:59'))
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange
  })

  const stats = {
    total: payments.reduce((acc, p) => (p.type === 'RENTAL_FEE' || p.type === 'EXTRA_CHARGE' || p.type === 'DAMAGE_CHARGE') ? acc + p.amount : acc, 0),
    refunded: payments.reduce((acc, p) => p.type === 'REFUND' ? acc + p.amount : acc, 0),
    pending: payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0),
    succeeded: payments.filter(p => p.status === 'SUCCEEDED').length,
    failed: payments.filter(p => p.status === 'FAILED').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Payments</h1>
          <p className="text-neutral-600 mt-2">Manage all payment transactions and refunds</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-bold text-neutral-900">${stats.total.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Refunded</p>
              <p className="text-2xl font-bold text-red-600">${stats.refunded.toLocaleString()}</p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.pending.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Succeeded</p>
              <p className="text-2xl font-bold text-green-600">{stats.succeeded}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 pr-8 border rounded-lg text-sm appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 pr-8 border rounded-lg text-sm appearance-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="RENTAL_FEE">Rental Fees</option>
            <option value="EXTRA_CHARGE">Extra Charges</option>
            <option value="REFUND">Refunds</option>
            <option value="DAMAGE_CHARGE">Damage Charges</option>
          </select>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-auto"
          />
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-auto"
          />
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Transaction</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPayments.map((payment) => {
                const status = statusConfig[payment.status] || statusConfig.PENDING
                const StatusIcon = status.icon
                const type = typeConfig[payment.type as keyof typeof typeConfig] || typeConfig.RENTAL_FEE
                const TypeIcon = type?.icon || DollarSign
                
                return (
                  <tr key={payment.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">{payment.bookingNumber}</p>
                        {payment.stripePaymentIntentId && (
                          <p className="text-xs text-neutral-600">{payment.stripePaymentIntentId}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-neutral-900">{payment.customerName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-medium ${type.color}`}>{type.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-900">{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`font-medium ${
                        payment.type === 'REFUND' ? 'text-red-600' : 'text-neutral-900'
                      }`}>
                        {payment.type === 'REFUND' ? '-' : ''}${payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg}`}>
                        <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm text-neutral-900">
                          {format(payment.createdAt, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {format(payment.createdAt, 'h:mm a')}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowDetailsModal(true)
                          }}
                          title="View transaction details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailsModal(false)
              setSelectedPayment(null)
            }
          }}
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Payment Details</h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setSelectedPayment(null)
                  }}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Transaction Info */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Transaction Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-600">Transaction ID</p>
                      <p className="font-medium text-neutral-900">{selectedPayment.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Booking Number</p>
                      <p className="font-medium text-neutral-900">{selectedPayment.bookingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Type</p>
                      <p className="font-medium text-neutral-900">{selectedPayment.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Status</p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                        statusConfig[selectedPayment.status].bg
                      }`}>
                        <span className={`text-sm font-medium ${statusConfig[selectedPayment.status].color}`}>
                          {statusConfig[selectedPayment.status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-600">Amount</p>
                      <p className="font-medium text-neutral-900 text-lg">${selectedPayment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Method</p>
                      <p className="font-medium text-neutral-900">{selectedPayment.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Date</p>
                      <p className="font-medium text-neutral-900">
                        {format(selectedPayment.createdAt, 'MMMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                    {selectedPayment.processedAt && (
                      <div>
                        <p className="text-sm text-neutral-600">Processed At</p>
                        <p className="font-medium text-neutral-900">
                          {format(selectedPayment.processedAt, 'MMMM dd, yyyy h:mm a')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-600">Name</p>
                      <p className="font-medium text-neutral-900">{selectedPayment.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Email</p>
                      <p className="font-medium text-neutral-900">{selectedPayment.customerEmail || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Stripe Info */}
                {selectedPayment.stripePaymentIntentId && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">Stripe Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-neutral-600">Payment Intent ID</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm text-neutral-900">{selectedPayment.stripePaymentIntentId}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (selectedPayment.stripePaymentIntentId) {
                                navigator.clipboard.writeText(selectedPayment.stripePaymentIntentId)
                              }
                            }}
                            title="Copy to clipboard"
                          >
                            <CreditCard className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {selectedPayment.stripeChargeId && (
                        <div>
                          <p className="text-sm text-neutral-600">Charge ID</p>
                          <p className="font-mono text-sm text-neutral-900">{selectedPayment.stripeChargeId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    Print Receipt
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false)
                      setSelectedPayment(null)
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}