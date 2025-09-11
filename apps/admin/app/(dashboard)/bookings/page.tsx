'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  DollarSign,
  RefreshCw,
  ChevronDown,
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
    isVerified: boolean
  }
  car: {
    id: string
    displayName: string
    make: string
    model: string
    year: number
    category: string
    primaryImageUrl: string
  }
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string
  basePriceTotal: string
  addOnsTotal: string
  feesTotal: string
  taxTotal: string
  totalAmount: string
  customerNotes: string
  internalNotes: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  paymentStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'FAILED'
  createdAt: string
  updatedAt: string
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
  const router = useRouter()
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [editFormData, setEditFormData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    returnLocation: '',
    customerNotes: '',
    internalNotes: '',
    status: '',
    paymentStatus: '',
    basePriceTotal: '',
    addOnsTotal: '',
    feesTotal: '',
    taxTotal: '',
    totalAmount: ''
  })
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])
  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showQuickActions && !(event.target as Element).closest('.dropdown-container')) {
        setShowQuickActions(null)
      }
    }

    if (showQuickActions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showQuickActions])

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
    try {
      console.log(`🔄 Updating booking ${bookingId} to status: ${newStatus}`)
      
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Booking status updated successfully:', result)
        
        // Update local state with the new status
        setBookings(prev => 
          prev.map(b => b.id === bookingId ? { ...b, status: newStatus as any } : b)
        )
      } else {
        console.error('❌ Failed to update booking status:', response.status)
        alert('Failed to update booking status. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error updating booking status:', error)
      alert('Error updating booking status. Please try again.')
    }
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
    
    exportToCSV(bookings, columns, 'bookings')
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

  const handleEditBooking = async () => {
    if (!editingBooking) return

    setEditLoading(true)
    try {
      const response = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: editFormData.startDate,
          endDate: editFormData.endDate,
          pickupLocation: editFormData.pickupLocation,
          returnLocation: editFormData.returnLocation,
          customerNotes: editFormData.customerNotes,
          internalNotes: editFormData.internalNotes,
          status: editFormData.status,
          paymentStatus: editFormData.paymentStatus,
          basePriceTotal: parseFloat(editFormData.basePriceTotal),
          addOnsTotal: parseFloat(editFormData.addOnsTotal),
          feesTotal: parseFloat(editFormData.feesTotal),
          taxTotal: parseFloat(editFormData.taxTotal),
          totalAmount: parseFloat(editFormData.totalAmount)
        })
      })

      if (response.ok) {
        alert('Booking updated successfully!')
        setShowEditModal(false)
        setEditingBooking(null)
        fetchBookings() // Refresh the bookings list
      } else {
        const errorData = await response.json()
        alert(`Error updating booking: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Error updating booking. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  const calculateTotal = () => {
    const base = parseFloat(editFormData.basePriceTotal) || 0
    const addons = parseFloat(editFormData.addOnsTotal) || 0
    const fees = parseFloat(editFormData.feesTotal) || 0
    const tax = parseFloat(editFormData.taxTotal) || 0
    return (base + addons + fees + tax).toFixed(2)
  }

  const handleSendConfirmation = async () => {
    if (!selectedBooking || !selectedBooking.customer?.email) {
      alert('No customer email available for this booking.')
      return
    }

    try {
      const response = await fetch('/api/bookings/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          customerEmail: selectedBooking.customer.email,
          customerName: selectedBooking.customer.name,
          bookingNumber: selectedBooking.bookingNumber,
          carName: selectedBooking.car?.displayName || 'Vehicle',
          startDate: selectedBooking.startDate,
          endDate: selectedBooking.endDate,
          pickupLocation: selectedBooking.pickupLocation || 'Showroom',
          totalAmount: selectedBooking.totalAmount
        })
      })

      if (response.ok) {
        alert('Confirmation email sent successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to send email: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      alert('Error sending confirmation email. Please try again.')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    
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
          <p className="text-neutral-600 mt-2">Monitor and manage customer bookings from the website</p>
        </div>
        <div className="flex gap-2">
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
              title="Show/hide advanced filter options"
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
                      {booking.car?.primaryImageUrl ? (
                        <Image
                          src={booking.car.primaryImageUrl}
                          alt={booking.car.displayName}
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
                          <span>{booking.customer?.name}</span>
                          {booking.customer?.isVerified && (
                            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                          )}
        </div>
                        <div className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5" />
                          <span>{booking.car?.displayName}</span>
            </div>
          </div>

                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                            {' '}({Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days)
                          </span>
        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{booking.pickupLocation}</span>
            </div>
          </div>
        </div>
      </div>

                  {/* Right Section - Amount & Actions */}
                  <div className="flex items-start gap-6">
                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neutral-900">${parseFloat(booking.totalAmount).toLocaleString()}</p>
                      <p className="text-sm text-neutral-600">
                        {booking.paymentStatus === 'PAID' ? (
                          <span className="text-green-600">Fully Paid</span>
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
                        title="View booking details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Edit booking"
                        onClick={() => {
                          setEditingBooking(booking)
                          setEditFormData({
                            startDate: format(new Date(booking.startDate), 'yyyy-MM-dd'),
                            endDate: format(new Date(booking.endDate), 'yyyy-MM-dd'),
                            pickupLocation: booking.pickupLocation || '',
                            returnLocation: booking.returnLocation || '',
                            customerNotes: booking.customerNotes || '',
                            internalNotes: booking.internalNotes || '',
                            status: booking.status,
                            paymentStatus: booking.paymentStatus,
                            basePriceTotal: booking.basePriceTotal || booking.totalAmount,
                            addOnsTotal: booking.addOnsTotal || '0',
                            feesTotal: booking.feesTotal || '0',
                            taxTotal: booking.taxTotal || '0',
                            totalAmount: booking.totalAmount
                          })
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <div className="relative dropdown-container">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowQuickActions(showQuickActions === booking.id ? null : booking.id)}
                          title="More actions"
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
                    <span>{booking.customer?.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{booking.customer?.phone}</span>
                  </div>
                  {false && (
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
                        <p className="font-medium">N/A</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-neutral-600">Address</p>
                        <p className="font-medium">N/A</p>
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
                        {selectedBooking.car?.primaryImageUrl && (
                          <Image
                            src={selectedBooking.car.primaryImageUrl}
                            alt={selectedBooking.car?.displayName || 'Vehicle'}
                            fill
                            className="object-cover"
                          />
                        )}
                </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-600">Vehicle</p>
                          <p className="font-medium">{selectedBooking.car?.displayName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Make/Model</p>
                          <p className="font-medium">{selectedBooking.car?.make} {selectedBooking.car?.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Year</p>
                          <p className="font-medium">{selectedBooking.car?.year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Category</p>
                          <p className="font-medium">{selectedBooking.car?.category || 'N/A'}</p>
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
                            {format(new Date(selectedBooking.startDate), 'MMM dd, yyyy')} at 10:00 AM
                          </p>
                          <p className="text-sm text-neutral-600 mt-1">{selectedBooking.pickupLocation || 'Showroom'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Return</p>
                          <p className="font-medium">
                            {format(new Date(selectedBooking.endDate), 'MMM dd, yyyy')} at 10:00 AM
                          </p>
                          <p className="text-sm text-neutral-600 mt-1">{selectedBooking.returnLocation || 'Showroom'}</p>
                        </div>
                      </div>
                      {selectedBooking.addOnsTotal && parseFloat(selectedBooking.addOnsTotal) > 0 && (
                        <div>
                          <p className="text-sm text-neutral-600 mb-2">Add-ons</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Additional Services</span>
                              <span>${parseFloat(selectedBooking.addOnsTotal).toLocaleString()}</span>
                            </div>
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
                        <span>${parseFloat(selectedBooking.basePriceTotal || selectedBooking.totalAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Add-ons</span>
                        <span>${parseFloat(selectedBooking.addOnsTotal || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Fees</span>
                        <span>${parseFloat(selectedBooking.feesTotal || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Tax</span>
                        <span>${parseFloat(selectedBooking.taxTotal || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>${parseFloat(selectedBooking.totalAmount).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Paid</span>
                          <span className="text-green-600">${parseFloat(selectedBooking.totalAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Balance</span>
                          <span className="text-green-600">$0</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Actions */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        leftIcon={<Send className="h-4 w-4" />}
                        onClick={handleSendConfirmation}
                        disabled={!selectedBooking.customer?.email}
                      >
                        Send Confirmation
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
                  {/* Booking Created */}
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Booking Created</p>
                        <span className="text-xs text-neutral-500">
                          {format(new Date(selectedBooking.createdAt), 'MMM dd, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">by {selectedBooking.customer?.name || 'Customer'}</p>
                    </div>
                  </div>

                  {/* Payment Completed */}
                  {selectedBooking.paymentStatus === 'PAID' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">Payment Completed</p>
                          <span className="text-xs text-neutral-500">
                            {format(new Date(selectedBooking.createdAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">Payment processed successfully</p>
                      </div>
                    </div>
                  )}

                  {/* Status Updates */}
                  {selectedBooking.status === 'CONFIRMED' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">Booking Confirmed</p>
                          <span className="text-xs text-neutral-500">
                            {format(new Date(selectedBooking.updatedAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">Booking confirmed and ready</p>
                      </div>
                    </div>
                  )}

                  {selectedBooking.status === 'IN_PROGRESS' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">Rental Started</p>
                          <span className="text-xs text-neutral-500">
                            {format(new Date(selectedBooking.updatedAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">Vehicle pickup completed</p>
                      </div>
                    </div>
                  )}

                  {selectedBooking.status === 'COMPLETED' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">Rental Completed</p>
                          <span className="text-xs text-neutral-500">
                            {format(new Date(selectedBooking.updatedAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">Vehicle returned successfully</p>
                      </div>
                    </div>
                  )}

                  {selectedBooking.status === 'CANCELLED' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">Booking Cancelled</p>
                          <span className="text-xs text-neutral-500">
                            {format(new Date(selectedBooking.updatedAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">Booking was cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && editingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Edit Booking
                  </h2>
                  <p className="text-neutral-600 mt-1">
                    Booking #{editingBooking.bookingNumber}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingBooking(null)
                  }}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Booking Details */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Booking Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Start Date</label>
                          <Input
                            type="date"
                            value={editFormData.startDate}
                            onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">End Date</label>
                          <Input
                            type="date"
                            value={editFormData.endDate}
                            onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Pickup Location</label>
                        <Input
                          value={editFormData.pickupLocation}
                          onChange={(e) => setEditFormData({...editFormData, pickupLocation: e.target.value})}
                          placeholder="Enter pickup location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Return Location</label>
                        <Input
                          value={editFormData.returnLocation}
                          onChange={(e) => setEditFormData({...editFormData, returnLocation: e.target.value})}
                          placeholder="Enter return location"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Status */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Status</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Booking Status</label>
                        <select
                          className="w-full p-2 border border-neutral-200 rounded-md focus:border-neutral-400 focus:ring-0"
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="NO_SHOW">No Show</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Payment Status</label>
                        <select
                          className="w-full p-2 border border-neutral-200 rounded-md focus:border-neutral-400 focus:ring-0"
                          value={editFormData.paymentStatus}
                          onChange={(e) => setEditFormData({...editFormData, paymentStatus: e.target.value})}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="PAID">Paid</option>
                          <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
                          <option value="REFUNDED">Refunded</option>
                          <option value="FAILED">Failed</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Pricing */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Pricing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Base Price</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editFormData.basePriceTotal}
                          onChange={(e) => {
                            const newBase = e.target.value
                            const addons = parseFloat(editFormData.addOnsTotal) || 0
                            const fees = parseFloat(editFormData.feesTotal) || 0
                            const tax = parseFloat(editFormData.taxTotal) || 0
                            const total = (parseFloat(newBase) || 0) + addons + fees + tax
                            setEditFormData({...editFormData, basePriceTotal: newBase, totalAmount: total.toFixed(2)})
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Add-ons</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editFormData.addOnsTotal}
                          onChange={(e) => {
                            const newAddons = e.target.value
                            const base = parseFloat(editFormData.basePriceTotal) || 0
                            const fees = parseFloat(editFormData.feesTotal) || 0
                            const tax = parseFloat(editFormData.taxTotal) || 0
                            const total = base + (parseFloat(newAddons) || 0) + fees + tax
                            setEditFormData({...editFormData, addOnsTotal: newAddons, totalAmount: total.toFixed(2)})
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Fees</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editFormData.feesTotal}
                          onChange={(e) => {
                            const newFees = e.target.value
                            const base = parseFloat(editFormData.basePriceTotal) || 0
                            const addons = parseFloat(editFormData.addOnsTotal) || 0
                            const tax = parseFloat(editFormData.taxTotal) || 0
                            const total = base + addons + (parseFloat(newFees) || 0) + tax
                            setEditFormData({...editFormData, feesTotal: newFees, totalAmount: total.toFixed(2)})
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Tax</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editFormData.taxTotal}
                          onChange={(e) => {
                            const newTax = e.target.value
                            const base = parseFloat(editFormData.basePriceTotal) || 0
                            const addons = parseFloat(editFormData.addOnsTotal) || 0
                            const fees = parseFloat(editFormData.feesTotal) || 0
                            const total = base + addons + fees + (parseFloat(newTax) || 0)
                            setEditFormData({...editFormData, taxTotal: newTax, totalAmount: total.toFixed(2)})
                          }}
                        />
                      </div>
                      <div className="pt-4 border-t border-neutral-200">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Total Amount (Auto-calculated)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={calculateTotal()}
                          disabled
                          className="font-semibold bg-neutral-100 cursor-not-allowed opacity-75"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Notes */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-4">Notes</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Customer Notes</label>
                        <textarea
                          className="w-full p-2 border border-neutral-200 rounded-md focus:border-neutral-400 focus:ring-0 h-20 resize-none"
                          value={editFormData.customerNotes}
                          onChange={(e) => setEditFormData({...editFormData, customerNotes: e.target.value})}
                          placeholder="Customer notes..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Internal Notes</label>
                        <textarea
                          className="w-full p-2 border border-neutral-200 rounded-md focus:border-neutral-400 focus:ring-0 h-20 resize-none"
                          value={editFormData.internalNotes}
                          onChange={(e) => setEditFormData({...editFormData, internalNotes: e.target.value})}
                          placeholder="Internal notes..."
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-neutral-50">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingBooking(null)
                  }}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditBooking}
                  disabled={editLoading}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Update Booking
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

