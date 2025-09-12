'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Car, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical,
  Upload,
  DollarSign,
  Calendar,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench
} from 'lucide-react'
import { Button, Card, Input } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ConfirmationModal } from '../../../components/ui/confirmation-modal'

interface Vehicle {
  id: string
  displayName: string
  make: string
  model: string
  year: number
  category: string
  status: 'ACTIVE' | 'MAINTENANCE' | 'RETIRED' | 'COMING_SOON'
  pricePerDay: number
  primaryImageUrl: string
  licensePlate: string
  vin: string
  featured: boolean
  bookingsCount: number
  revenue: number
  utilization: number
}

const statusConfig = {
  ACTIVE: { 
    label: 'Active', 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  MAINTENANCE: { 
    label: 'Maintenance', 
    icon: Wrench, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  },
  RETIRED: { 
    label: 'Retired', 
    icon: XCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  COMING_SOON: { 
    label: 'Coming Soon', 
    icon: AlertCircle, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
}

export default function VehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [vehiclesToDelete, setVehiclesToDelete] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      // In production, this would be an API call
      setVehicles([
        {
          id: '1',
          displayName: 'Mercedes-AMG C43',
          make: 'Mercedes-Benz',
          model: 'C43 AMG',
          year: 2024,
          category: 'LUXURY',
          status: 'ACTIVE',
          pricePerDay: 450,
          primaryImageUrl: '/C43Silver-1.jpg',
          licensePlate: 'FLY-001',
          vin: 'WDD1234567890',
          featured: true,
          bookingsCount: 24,
          revenue: 45600,
          utilization: 78
        },
        {
          id: '2',
          displayName: 'Porsche Cayenne',
          make: 'Porsche',
          model: 'Cayenne',
          year: 2024,
          category: 'SUV',
          status: 'ACTIVE',
          pricePerDay: 550,
          primaryImageUrl: '/PorscheCayenneWhite-1.jpg',
          licensePlate: 'FLY-002',
          vin: 'WP1234567890',
          featured: true,
          bookingsCount: 18,
          revenue: 38900,
          utilization: 65
        },
        {
          id: '3',
          displayName: 'Mercedes CLA 250',
          make: 'Mercedes-Benz',
          model: 'CLA 250',
          year: 2018,
          category: 'LUXURY',
          status: 'MAINTENANCE',
          pricePerDay: 350,
          primaryImageUrl: '/2018-CLA250.jpg',
          licensePlate: 'FLY-003',
          vin: 'WDD0987654321',
          featured: false,
          bookingsCount: 32,
          revenue: 52300,
          utilization: 82
        }
      ])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
      setLoading(false)
    }
  }

  const handleStatusChange = async (vehicleId: string, newStatus: string) => {
    // In production, this would be an API call
    setVehicles(prev => 
      prev.map(v => v.id === vehicleId ? { ...v, status: newStatus as any } : v)
    )
  }

  const handleDelete = async (vehicleId: string) => {
    setVehiclesToDelete([vehicleId])
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      // In production, this would be an API call
      // For now, just remove from the list
      setVehicles(prev => prev.filter(v => !vehiclesToDelete.includes(v.id)))
      setSelectedVehicles(prev => prev.filter(id => !vehiclesToDelete.includes(id)))
    } catch (error) {
      console.error('Failed to delete vehicles:', error)
    } finally {
      setDeleting(false)
      setDeleteModalOpen(false)
      setVehiclesToDelete([])
    }
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'activate':
        selectedVehicles.forEach(id => handleStatusChange(id, 'ACTIVE'))
        break
      case 'maintenance':
        selectedVehicles.forEach(id => handleStatusChange(id, 'MAINTENANCE'))
        break
      case 'retire':
        selectedVehicles.forEach(id => handleStatusChange(id, 'RETIRED'))
        break
      case 'delete':
        setVehiclesToDelete([...selectedVehicles])
        setDeleteModalOpen(true)
        break
    }
    setSelectedVehicles([])
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus
    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
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
          <h1 className="text-3xl font-bold text-neutral-900">Vehicle Management</h1>
          <p className="text-neutral-600 mt-2">Manage your fleet inventory and availability</p>
        </div>
        <Button 
          onClick={() => router.push('/vehicles/new')} 
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-neutral-900">{vehicles.length}</p>
            </div>
            <Car className="h-8 w-8 text-amber-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'ACTIVE').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">In Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">
                {vehicles.filter(v => v.status === 'MAINTENANCE').length}
              </p>
            </div>
            <Wrench className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Avg. Utilization</p>
              <p className="text-2xl font-bold text-neutral-900">
                {Math.round(vehicles.reduce((acc, v) => acc + v.utilization, 0) / vehicles.length)}%
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Filter className="h-4 w-4" />}
            >
              <span className="flex items-center gap-2">
                Filters
                {(filterStatus !== 'all' || filterCategory !== 'all') && (
                  <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                    Active
                  </span>
                )}
              </span>
            </Button>
            {selectedVehicles.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                  className="text-green-600"
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkAction('maintenance')}
                  className="text-orange-600"
                >
                  Maintenance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RETIRED">Retired</option>
              <option value="COMING_SOON">Coming Soon</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="LUXURY">Luxury</option>
              <option value="SPORT">Sport</option>
              <option value="SUV">SUV</option>
              <option value="ELECTRIC">Electric</option>
            </select>
          </div>
        )}
      </Card>

      {/* Vehicles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVehicles.length === filteredVehicles.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVehicles(filteredVehicles.map(v => v.id))
                      } else {
                        setSelectedVehicles([])
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Vehicle</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Details</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Price/Day</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Performance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredVehicles.map((vehicle) => {
                const status = statusConfig[vehicle.status]
                const StatusIcon = status.icon
                
                return (
                  <tr key={vehicle.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVehicles([...selectedVehicles, vehicle.id])
                          } else {
                            setSelectedVehicles(selectedVehicles.filter(id => id !== vehicle.id))
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-neutral-100">
                          {vehicle.primaryImageUrl ? (
                            <Image
                              src={vehicle.primaryImageUrl}
                              alt={vehicle.displayName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Car className="h-6 w-6 text-neutral-400" />
                            </div>
                          )}
                          {vehicle.featured && (
                            <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded">
                              Featured
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{vehicle.displayName}</p>
                          <p className="text-sm text-neutral-600">{vehicle.year} • {vehicle.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-neutral-900">
                          <span className="text-neutral-600">Plate:</span> {vehicle.licensePlate}
                        </p>
                        <p className="text-sm text-neutral-900">
                          <span className="text-neutral-600">VIN:</span> {vehicle.vin}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border`}>
                        <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-neutral-900">${vehicle.pricePerDay}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: `${vehicle.utilization}%` }}
                            />
                          </div>
                          <span className="text-sm text-neutral-600">{vehicle.utilization}%</span>
                        </div>
                        <div className="flex gap-4 text-xs text-neutral-600">
                          <span>{vehicle.bookingsCount} bookings</span>
                          <span>${(vehicle.revenue / 1000).toFixed(1)}k revenue</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/vehicles/${vehicle.id}` as any)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/vehicles/${vehicle.id}/edit` as any)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/vehicles/${vehicle.id}/pricing`)}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/vehicles/${vehicle.id}/availability`)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <div className="relative group">
                          <Button
                            size="sm"
                            variant="ghost"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              onClick={() => handleStatusChange(vehicle.id, 'ACTIVE')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Set Active
                            </button>
                            <button
                              onClick={() => handleStatusChange(vehicle.id, 'MAINTENANCE')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                            >
                              <Wrench className="h-4 w-4 text-orange-600" />
                              Set Maintenance
                            </button>
                            <button
                              onClick={() => handleStatusChange(vehicle.id, 'RETIRED')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                              Retire Vehicle
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => handleDelete(vehicle.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={vehiclesToDelete.length === 1 ? 'Delete Vehicle' : `Delete ${vehiclesToDelete.length} Vehicles`}
        description={
          vehiclesToDelete.length === 1
            ? 'Are you sure you want to delete this vehicle? This action cannot be undone.'
            : `Are you sure you want to delete ${vehiclesToDelete.length} vehicles? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  )
}

