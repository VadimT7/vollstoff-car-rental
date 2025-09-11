'use client'

import { useState, useEffect } from 'react'
import { 
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Car,
  CreditCard,
  FileText,
  MessageSquare,
  Ban,
  UserCheck,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin
} from 'lucide-react'
import { Button, Card, Input } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import { format } from 'date-fns'
import { exportToCSV, type ExportColumn, formatters } from '@/lib/export-utils'
import Image from 'next/image'
import { Toast, useToast } from '../../../components/ui/toast'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  verified: boolean
  licenseVerified: boolean
  dateOfBirth?: Date
  licenseNumber?: string
  licenseExpiry?: Date
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  stats: {
    totalBookings: number
    completedBookings: number
    cancelledBookings: number
    totalSpent: number
    averageBookingValue: number
    lastBookingDate?: Date
    favoriteVehicleCategory?: string
  }
  loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  notes?: string
  tags: string[]
  createdAt: Date
  lastActive: Date
}

const statusConfig = {
  ACTIVE: { 
    label: 'Active', 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  SUSPENDED: { 
    label: 'Suspended', 
    icon: AlertCircle, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  },
  DELETED: { 
    label: 'Deleted', 
    icon: XCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-50',
    border: 'border-red-200'
  }
}

const loyaltyConfig = {
  BRONZE: { label: 'Bronze', color: 'text-orange-700', bg: 'bg-orange-100' },
  SILVER: { label: 'Silver', color: 'text-gray-700', bg: 'bg-gray-100' },
  GOLD: { label: 'Gold', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  PLATINUM: { label: 'Platinum', color: 'text-purple-700', bg: 'bg-purple-100' }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterVerified, setFilterVerified] = useState<string>('all')
  const [filterLoyalty, setFilterLoyalty] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({})
  const [saving, setSaving] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])
  // Handle clicking outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDetails && !(event.target as Element).closest('.modal-container')) {
        setShowDetails(false)
      }
    }

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDetails])

  const fetchCustomers = async () => {
    try {
      console.log('👥 Fetching customers from API...')
      const response = await fetch('/api/customers')
      if (response.ok) {
        const apiCustomers = await response.json()
        console.log('✅ Customers fetched:', apiCustomers.length)
        
        // Transform API data to match the expected Customer interface
        const transformedCustomers: Customer[] = apiCustomers.map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          status: customer.status,
          verified: false, // Default to false since API doesn't provide this
          licenseVerified: false, // Default to false since API doesn't provide this
          address: {
            line1: 'Not provided',
            city: 'Not provided',
            state: 'Not provided',
            postalCode: 'Not provided',
            country: 'Not provided'
          },
          stats: {
            totalBookings: customer.totalBookings,
            completedBookings: customer.totalBookings, // Assume all are completed for now
            cancelledBookings: 0,
            totalSpent: parseFloat(customer.totalSpent) || 0,
            averageBookingValue: customer.totalBookings > 0 ? (parseFloat(customer.totalSpent) || 0) / customer.totalBookings : 0,
            lastBookingDate: customer.recentBookings?.[0]?.createdAt ? new Date(customer.recentBookings[0].createdAt) : undefined
          },
          loyaltyTier: 'BRONZE', // Default tier
          tags: [],
          createdAt: new Date(customer.createdAt),
          lastActive: new Date(customer.updatedAt)
        }))
        
        setCustomers(transformedCustomers)
      } else {
        console.error('❌ Failed to fetch customers:', response.status)
        setCustomers([])
      }
    } catch (error) {
      console.error('❌ Error fetching customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const columns: ExportColumn[] = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status', format: formatters.status },
      { key: 'verified', label: 'Email Verified', format: formatters.boolean },
      { key: 'licenseVerified', label: 'License Verified', format: formatters.boolean },
      { key: 'loyaltyTier', label: 'Loyalty Tier' },
      { key: 'totalBookings', label: 'Total Bookings' },
      { key: 'totalSpent', label: 'Total Spent', format: formatters.currency },
      { key: 'averageRating', label: 'Average Rating' },
      { key: 'licenseNumber', label: 'License Number' },
      { key: 'licenseExpiry', label: 'License Expiry', format: formatters.date },
      { key: 'address.line1', label: 'Address Line 1' },
      { key: 'address.city', label: 'City' },
      { key: 'address.state', label: 'State' },
      { key: 'address.zipCode', label: 'Zip Code' },
      { key: 'address.country', label: 'Country' },
      { key: 'createdAt', label: 'Registration Date', format: formatters.datetime },
      { key: 'lastBookingAt', label: 'Last Booking', format: formatters.datetime }
    ]
    
    exportToCSV(customers, columns, 'customers')
  }

  const handleStatusChange = async (customerId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating customer ${customerId} to status: ${newStatus}`)
      
      const response = await fetch('/api/customers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          status: newStatus
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Customer status updated successfully:', result)
        
        // Update local state with the new status
        setCustomers(prev => 
          prev.map(c => c.id === customerId ? { ...c, status: newStatus as any } : c)
        )
      } else {
        console.error('❌ Failed to update customer status:', response.status)
        alert('Failed to update customer status. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error updating customer status:', error)
      alert('Error updating customer status. Please try again.')
    }
  }

  const handleVerification = async (customerId: string) => {
    setCustomers(prev => 
      prev.map(c => c.id === customerId ? { ...c, verified: true, licenseVerified: true } : c)
    )
  }

  const handleUnsuspend = async (customerId: string) => {
    // Use the same API call method as handleStatusChange
    await handleStatusChange(customerId, 'ACTIVE')
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditFormData({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      loyaltyTier: customer.loyaltyTier,
      address: { ...customer.address },
      notes: customer.notes || ''
    })
    setShowEditModal(true)
  }

  const handleSaveCustomer = async () => {
    if (!editFormData.id) return
    
    setSaving(true)
    try {
      console.log('💾 Saving customer updates:', editFormData)
      
      const response = await fetch('/api/customers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: editFormData.id,
          ...editFormData
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Customer updated successfully:', result)
        
        // Update local state with the new data
        setCustomers(prev => 
          prev.map(c => c.id === editFormData.id ? {
            ...c,
            name: editFormData.name || c.name,
            email: editFormData.email || c.email,
            phone: editFormData.phone || c.phone,
            status: editFormData.status || c.status,
            loyaltyTier: editFormData.loyaltyTier || c.loyaltyTier,
            address: editFormData.address || c.address,
            notes: editFormData.notes
          } : c)
        )
        
        setShowEditModal(false)
        setEditFormData({})
        showToast('Customer information saved successfully!', 'success')
      } else {
        console.error('❌ Failed to update customer:', response.status)
        showToast('Failed to update customer. Please try again.', 'error')
      }
    } catch (error) {
      console.error('❌ Error updating customer:', error)
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'email':
        console.log('Send email to:', selectedCustomers)
        break
      case 'export':
        console.log('Export customers:', selectedCustomers)
        break
      case 'suspend':
        selectedCustomers.forEach(id => handleStatusChange(id, 'SUSPENDED'))
        break
    }
    setSelectedCustomers([])
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    const matchesVerified = filterVerified === 'all' || 
      (filterVerified === 'verified' && customer.verified) ||
      (filterVerified === 'unverified' && !customer.verified)
    const matchesLoyalty = filterLoyalty === 'all' || customer.loyaltyTier === filterLoyalty
    
    return matchesSearch && matchesStatus && matchesVerified && matchesLoyalty
  })

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'ACTIVE').length,
    verified: customers.filter(c => c.verified).length,
    vip: customers.filter(c => c.loyaltyTier === 'GOLD' || c.loyaltyTier === 'PLATINUM').length,
    totalRevenue: customers.reduce((acc, c) => acc + c.stats.totalSpent, 0)
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
          <h1 className="text-3xl font-bold text-neutral-900">Customer Management</h1>
          <p className="text-neutral-600 mt-2">Manage customer profiles, verification, and loyalty</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Customers</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-amber-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Verified</p>
              <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">VIP Customers</p>
              <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-bold text-neutral-900">${(stats.totalRevenue / 1000).toFixed(0)}k</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
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
                placeholder="Search customers..."
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
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DELETED">Deleted</option>
          </select>
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="px-3 py-2 pr-8 border rounded-lg text-sm appearance-none bg-white"
          >
            <option value="all">All Customers</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified</option>
          </select>
          <select
            value={filterLoyalty}
            onChange={(e) => setFilterLoyalty(e.target.value)}
            className="px-3 py-2 pr-8 border rounded-lg text-sm appearance-none bg-white"
          >
            <option value="all">All Tiers</option>
            <option value="BRONZE">Bronze</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="PLATINUM">Platinum</option>
          </select>
          {selectedCustomers.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkAction('email')}
                className="gap-2"
                title="Send email to selected customers"
              >
                <Mail className="h-4 w-4" />
                Email ({selectedCustomers.length})
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomers(filteredCustomers.map(c => c.id))
                      } else {
                        setSelectedCustomers([])
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Loyalty</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Stats</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Last Active</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => {
                const status = statusConfig[customer.status]
                const StatusIcon = status.icon
                const loyalty = loyaltyConfig[customer.loyaltyTier]
                
                return (
                  <tr key={customer.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers([...selectedCustomers, customer.id])
                          } else {
                            setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id))
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-amber-700 font-medium">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-neutral-900">{customer.name}</p>
                            {customer.verified && (
                              <Shield className="h-3.5 w-3.5 text-blue-600" />
                            )}
                            {customer.licenseVerified && (
                              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                            )}
                          </div>
                          {customer.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {customer.tags.map((tag, idx) => (
                                <span key={idx} className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-neutral-600">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-neutral-600">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border`}>
                        <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-lg ${loyalty.bg}`}>
                        <span className={`text-sm font-medium ${loyalty.color}`}>{loyalty.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="text-neutral-900">{customer.stats.totalBookings} bookings</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="text-neutral-900">${customer.stats.totalSpent.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-neutral-900">
                          {format(customer.lastActive, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-neutral-600">
                          Joined {format(customer.createdAt, 'MMM yyyy')}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setShowDetails(true)
                          }}
                          title="View customer details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCustomer(customer)}
                          title="Edit customer information"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {customer.status === 'SUSPENDED' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600"
                            onClick={() => handleUnsuspend(customer.id)}
                            title="Unsuspend customer account"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-container">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-700 font-bold text-xl">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{selectedCustomer.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${loyaltyConfig[selectedCustomer.loyaltyTier].bg} ${loyaltyConfig[selectedCustomer.loyaltyTier].color}`}>
                        {loyaltyConfig[selectedCustomer.loyaltyTier].label}
                      </span>
                      {selectedCustomer.verified && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-neutral-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">License Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">License Number:</span>
                      <span>{selectedCustomer.licenseNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Expiry Date:</span>
                      <span>
                        {selectedCustomer.licenseExpiry 
                          ? format(selectedCustomer.licenseExpiry, 'MMM dd, yyyy')
                          : 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Verification Status:</span>
                      <span className={selectedCustomer.licenseVerified ? 'text-green-600' : 'text-orange-600'}>
                        {selectedCustomer.licenseVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Statistics */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Booking Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Total Bookings:</span>
                      <span>{selectedCustomer.stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Completed:</span>
                      <span className="text-green-600">{selectedCustomer.stats.completedBookings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Cancelled:</span>
                      <span className="text-red-600">{selectedCustomer.stats.cancelledBookings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Total Spent:</span>
                      <span className="font-medium">${selectedCustomer.stats.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Average Booking:</span>
                      <span>${selectedCustomer.stats.averageBookingValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Member Since:</span>
                      <span>{format(selectedCustomer.createdAt, 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Last Active:</span>
                      <span>{format(selectedCustomer.lastActive, 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Account Status:</span>
                      <span className={`font-medium ${statusConfig[selectedCustomer.status].color}`}>
                        {statusConfig[selectedCustomer.status].label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedCustomer.notes && (
                <div className="mt-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Notes</h3>
                  <p className="text-sm text-neutral-600">{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(`mailto:${selectedCustomer.email}`, '_blank')
                  }}
                  title="Open email app to send message"
                  leftIcon={<Mail className="h-4 w-4" />}
                >
                  Send Email
                </Button>
                {selectedCustomer.status === 'ACTIVE' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedCustomer.id, 'SUSPENDED')
                      setShowDetails(false)
                    }}
                    title="Suspend customer account"
                    leftIcon={<Ban className="h-4 w-4" />}
                    className="text-orange-600"
                  >
                    Suspend Account
                  </Button>
                )}
                {selectedCustomer.status === 'SUSPENDED' && (
                  <Button
                    onClick={() => {
                      handleUnsuspend(selectedCustomer.id)
                      setShowDetails(false)
                    }}
                    title="Reactivate suspended account"
                    leftIcon={<UserCheck className="h-4 w-4" />}
                    className="text-green-600"
                  >
                    Unsuspend Account
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Edit Customer Information</h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditFormData({})
                  }}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Basic Information */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                      <Input
                        type="text"
                        value={editFormData.name || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        placeholder="Customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                      <Input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                      <Input
                        type="tel"
                        value={editFormData.phone || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                      <select
                        value={editFormData.status || 'ACTIVE'}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="DELETED">Deleted</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 1</label>
                      <Input
                        type="text"
                        value={editFormData.address?.line1 || ''}
                        onChange={(e) => setEditFormData({ 
                          ...editFormData, 
                          address: { ...editFormData.address!, line1: e.target.value }
                        })}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 2</label>
                      <Input
                        type="text"
                        value={editFormData.address?.line2 || ''}
                        onChange={(e) => setEditFormData({ 
                          ...editFormData, 
                          address: { ...editFormData.address!, line2: e.target.value }
                        })}
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                      <Input
                        type="text"
                        value={editFormData.address?.city || ''}
                        onChange={(e) => setEditFormData({ 
                          ...editFormData, 
                          address: { ...editFormData.address!, city: e.target.value }
                        })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">State/Province</label>
                      <Input
                        type="text"
                        value={editFormData.address?.state || ''}
                        onChange={(e) => setEditFormData({ 
                          ...editFormData, 
                          address: { ...editFormData.address!, state: e.target.value }
                        })}
                        placeholder="State or Province"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Postal Code</label>
                      <Input
                        type="text"
                        value={editFormData.address?.postalCode || ''}
                        onChange={(e) => setEditFormData({ 
                          ...editFormData, 
                          address: { ...editFormData.address!, postalCode: e.target.value }
                        })}
                        placeholder="Postal code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
                      <Input
                        type="text"
                        value={editFormData.address?.country || ''}
                        onChange={(e) => setEditFormData({ 
                          ...editFormData, 
                          address: { ...editFormData.address!, country: e.target.value }
                        })}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Loyalty & Notes */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Loyalty & Notes</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Loyalty Tier</label>
                      <select
                        value={editFormData.loyaltyTier || 'BRONZE'}
                        onChange={(e) => setEditFormData({ ...editFormData, loyaltyTier: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="BRONZE">Bronze</option>
                        <option value="SILVER">Silver</option>
                        <option value="GOLD">Gold</option>
                        <option value="PLATINUM">Platinum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Notes</label>
                      <textarea
                        value={editFormData.notes || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                        placeholder="Add any notes about this customer..."
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditFormData({})
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCustomer}
                  disabled={saving}
                  className="min-w-[100px]"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}

