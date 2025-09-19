'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Car,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  DollarSign,
  RefreshCw,
  ChevronDown,
  Printer,
  Send
} from 'lucide-react'
import { Button, Card, Input } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import { format, addDays, differenceInDays } from 'date-fns'
import { exportToCSV, type ExportColumn, formatters } from '@/lib/export-utils'
import Image from 'next/image'

interface Booking {
  id: string
  bookingNumber: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
    verified: boolean
    licenseNumber: string
    address: string
  }
  vehicle: {
    id: string
    name: string
    plate: string
    image: string
    category: string
    vin: string
  }
  dates: {
    start: Date
    end: Date
    days: number
  }
  pickup: {
    type: 'SHOWROOM' | 'DELIVERY'
    location: string
    time: string
    notes?: string
  }
  return: {
    type: 'SHOWROOM' | 'DELIVERY'
    location: string
    time: string
    notes?: string
  }
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'FAILED'
  amount: {
    base: number
    addons: number
    fees: number
    tax: number
    total: number
    deposit: number
    paid: number
    balance: number
  }
  addons: Array<{
    name: string
    price: number
    quantity: number
  }>
  documents: {
    contract?: string
    invoice?: string
    receipt?: string
    damageReport?: string
  }
  timeline: Array<{
    event: string
    date: Date
    user: string
    notes?: string
  }>
  createdAt: Date
  updatedAt: Date
}

const statusConfig = {
  PENDING: { 
    label: 'Pending', 
    icon: Clock, 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  CONFIRMED: { 
    label: 'Confirmed', 
    icon: CheckCircle, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  IN_PROGRESS: { 
    label: 'In Progress', 
    icon: Car, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  COMPLETED: { 
    label: 'Completed', 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  CANCELLED: { 
    label: 'Cancelled', 
    icon: XCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  NO_SHOW: { 
    label: 'No Show', 
    icon: AlertCircle, 
    color: 'text-gray-600', 
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
}

export default function AdvancedBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      console.log('📋 Fetching bookings from API...')
      const response = await fetch('/api/bookings')
      
      if (response.ok) {
        const bookingsData = await response.json()
        console.log(`✅ Loaded ${bookingsData.length} bookings`)
        setBookings(bookingsData)
      } else {
        console.error('❌ Failed to fetch bookings:', response.status)
        setBookings([])
      }
    } catch (error) {
      console.error('❌ Failed to fetch bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus as any } : b)
    )
  }

  const handleExport = () => {
    const columns: ExportColumn[] = [
      { key: 'bookingNumber', label: 'Booking Number' },
      { key: 'customer.name', label: 'Customer Name' },
      { key: 'customer.email', label: 'Customer Email' },
      { key: 'vehicle.name', label: 'Vehicle' },
      { key: 'vehicle.plate', label: 'License Plate' },
      { key: 'dates.start', label: 'Start Date', format: formatters.date },
      { key: 'dates.end', label: 'End Date', format: formatters.date },
      { key: 'dates.days', label: 'Days' },
      { key: 'status', label: 'Status', format: formatters.status },
      { key: 'paymentStatus', label: 'Payment Status', format: formatters.status },
      { key: 'amount.total', label: 'Total Amount', format: formatters.currency },
      { key: 'amount.paid', label: 'Amount Paid', format: formatters.currency },
      { key: 'amount.balance', label: 'Balance', format: formatters.currency },
      { key: 'pickup.location', label: 'Pickup Location' },
      { key: 'return.location', label: 'Return Location' },
      { key: 'createdAt', label: 'Created Date', format: formatters.datetime }
    ]
    
    exportToCSV(bookings, columns, 'bookings-advanced')
  }

  const handleQuickAction = (bookingId: string, action: string) => {
    switch (action) {
      case 'confirm':
        handleStatusChange(bookingId, 'CONFIRMED')
        break
      case 'start':
        handleStatusChange(bookingId, 'IN_PROGRESS')
        break
      case 'complete':
        handleStatusChange(bookingId, 'COMPLETED')
        break
      case 'cancel':
        if (confirm('Are you sure you want to cancel this booking?')) {
          handleStatusChange(bookingId, 'CANCELLED')
        }
        break
    }
    setShowQuickActions(null)
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment
    
    return matchesSearch && matchesStatus && matchesPayment
  })

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
          <h1 className="text-3xl font-bold text-neutral-900">Booking Management</h1>
          <p className="text-neutral-600 mt-2">Complete booking lifecycle management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search by booking #, customer, vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              leftIcon={<Filter className="h-4 w-4" />}
              rightIcon={<ChevronDown className="h-4 w-4" />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              Advanced Filters
            </Button>
          </div>
        </div>
        
        {/* Collapsible Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 pr-8 border rounded-lg text-sm appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full px-3 py-2 pr-8 border rounded-lg text-sm appearance-none bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="PARTIALLY_PAID">Partially Paid</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Date Range
                </label>
                <div className="flex gap-1">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    console.log('Applying filters:', { filterStatus, filterPayment, dateRange })
                    // Here you would filter the bookings
                  }}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Bookings Grid */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => {
          const status = statusConfig[booking.status]
          const StatusIcon = status.icon
          
          return (
            <Card key={booking.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Left Section - Booking Info */}
                  <div className="flex gap-4">
                    {/* Vehicle Image */}
                    <div className="relative h-24 w-32 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      {booking.vehicle.image ? (
                        <Image
                          src={booking.vehicle.image}
                          alt={booking.vehicle.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Car className="h-8 w-8 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg text-neutral-900">
                          {booking.bookingNumber}
                        </h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border`}>
                          <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                          <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{booking.customer.name}</span>
                          {booking.customer.verified && (
                            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5" />
                          <span>{booking.vehicle.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {format(booking.dates.start, 'MMM dd')} - {format(booking.dates.end, 'MMM dd, yyyy')}
                            {' '}({booking.dates.days} days)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{booking.pickup.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Amount & Actions */}
                  <div className="flex items-start gap-6">
                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neutral-900">${booking.amount.total}</p>
                      <p className="text-sm text-neutral-600">
                        {booking.paymentStatus === 'PAID' ? (
                          <span className="text-green-600">Fully Paid</span>
                        ) : booking.amount.balance > 0 ? (
                          <span className="text-orange-600">Balance: ${booking.amount.balance}</span>
                        ) : (
                          <span className="text-yellow-600">Payment Pending</span>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowQuickActions(showQuickActions === booking.id ? null : booking.id)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        {showQuickActions === booking.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                            {booking.status === 'PENDING' && (
                              <button
                                onClick={() => handleQuickAction(booking.id, 'confirm')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Confirm Booking
                              </button>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleQuickAction(booking.id, 'start')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                              >
                                <Car className="h-4 w-4 text-blue-600" />
                                Start Rental
                              </button>
                            )}
                            {booking.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => handleQuickAction(booking.id, 'complete')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Complete Rental
                              </button>
                            )}
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              Send Message
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              Generate Contract
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => handleQuickAction(booking.id, 'cancel')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Timeline */}
                <div className="mt-4 pt-4 border-t flex items-center gap-6 text-xs text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Created {format(booking.createdAt, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{booking.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{booking.customer.phone}</span>
                  </div>
                  {booking.documents.contract && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Contract signed</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Detailed View Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {selectedBooking.bookingNumber}
                  </h2>
                  <p className="text-neutral-600 mt-1">
                    Created on {format(selectedBooking.createdAt, 'MMMM dd, yyyy')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Information */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-600">Name</p>
                        <p className="font-medium">{selectedBooking.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Email</p>
                        <p className="font-medium">{selectedBooking.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Phone</p>
                        <p className="font-medium">{selectedBooking.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">License</p>
                        <p className="font-medium">{selectedBooking.customer.licenseNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-neutral-600">Address</p>
                        <p className="font-medium">{selectedBooking.customer.address}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Vehicle Information */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vehicle Details
                    </h3>
                    <div className="flex gap-4">
                      <div className="relative h-20 w-28 rounded-lg overflow-hidden bg-neutral-100">
                        {selectedBooking.vehicle.image && (
                          <Image
                            src={selectedBooking.vehicle.image}
                            alt={selectedBooking.vehicle.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-600">Vehicle</p>
                          <p className="font-medium">{selectedBooking.vehicle.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Plate</p>
                          <p className="font-medium">{selectedBooking.vehicle.plate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">VIN</p>
                          <p className="font-medium">{selectedBooking.vehicle.vin}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Category</p>
                          <p className="font-medium">{selectedBooking.vehicle.category}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Rental Details */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Rental Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-600">Pickup</p>
                          <p className="font-medium">
                            {format(selectedBooking.dates.start, 'MMM dd, yyyy')} at {selectedBooking.pickup.time}
                          </p>
                          <p className="text-sm text-neutral-600 mt-1">{selectedBooking.pickup.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Return</p>
                          <p className="font-medium">
                            {format(selectedBooking.dates.end, 'MMM dd, yyyy')} at {selectedBooking.return.time}
                          </p>
                          <p className="text-sm text-neutral-600 mt-1">{selectedBooking.return.location}</p>
                        </div>
                      </div>
                      {selectedBooking.addons.length > 0 && (
                        <div>
                          <p className="text-sm text-neutral-600 mb-2">Add-ons</p>
                          <div className="space-y-1">
                            {selectedBooking.addons.map((addon, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{addon.name} {addon.quantity > 1 && `x${addon.quantity}`}</span>
                                <span>${addon.price * addon.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Status & Payment */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Status</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Booking Status</p>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusConfig[selectedBooking.status].bg} ${statusConfig[selectedBooking.status].border} border`}>
                          {(() => {
                            const Icon = statusConfig[selectedBooking.status].icon
                            return <Icon className={`h-4 w-4 ${statusConfig[selectedBooking.status].color}`} />
                          })()}
                          <span className={`text-sm font-medium ${statusConfig[selectedBooking.status].color}`}>
                            {statusConfig[selectedBooking.status].label}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Payment Status</p>
                        <p className="font-medium text-green-600">{selectedBooking.paymentStatus}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Payment Summary */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Base Amount</span>
                        <span>${selectedBooking.amount.base}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Add-ons</span>
                        <span>${selectedBooking.amount.addons}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Fees</span>
                        <span>${selectedBooking.amount.fees}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Tax</span>
                        <span>${selectedBooking.amount.tax}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>${selectedBooking.amount.total}</span>
                      </div>
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Paid</span>
                          <span className="text-green-600">${selectedBooking.amount.paid}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Balance</span>
                          <span className={selectedBooking.amount.balance > 0 ? 'text-orange-600' : 'text-green-600'}>
                            ${selectedBooking.amount.balance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Actions */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <Send className="h-4 w-4" />
                        Send Confirmation
                      </Button>
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <FileText className="h-4 w-4" />
                        Generate Contract
                      </Button>
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <Printer className="h-4 w-4" />
                        Print Invoice
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Timeline */}
              <Card className="p-4 mt-6">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {selectedBooking.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{event.event}</p>
                          <span className="text-xs text-neutral-500">
                            {format(event.date, 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">by {event.user}</p>
                        {event.notes && (
                          <p className="text-sm text-neutral-600 mt-1">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

