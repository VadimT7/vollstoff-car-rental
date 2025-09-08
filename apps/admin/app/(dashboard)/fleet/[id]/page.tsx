'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Car,
  DollarSign,
  Calendar,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench
} from 'lucide-react'
import { Button, Card } from '@valore/ui'
import Link from 'next/link'
import Image from 'next/image'

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

export default function VehicleViewPage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string
  
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicle()
  }, [vehicleId])

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/vehicles?id=${vehicleId}`)
      if (response.ok) {
        const vehicles = await response.json()
        const vehicle = vehicles.find((v: any) => v.id === vehicleId)
        setVehicle(vehicle || null)
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch vehicle:', error)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/vehicles?id=${vehicleId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok) {
          router.push('/fleet')
        } else {
          alert('Failed to delete vehicle')
        }
      } catch (error) {
        console.error('Failed to delete vehicle:', error)
        alert('Failed to delete vehicle. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/fleet">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">Vehicle Not Found</h1>
        </div>
        <Card className="p-6 text-center">
          <p className="text-neutral-600">The requested vehicle could not be found.</p>
          <Link href="/fleet">
            <Button className="mt-4">Back to Fleet</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const status = statusConfig[vehicle.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/fleet">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{vehicle.displayName}</h1>
            <p className="text-neutral-600 mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/fleet/${vehicleId}/edit`}>
            <Button leftIcon={<Edit className="h-4 w-4" />}>
              Edit Vehicle
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDelete} className="text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Vehicle Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Image */}
        <Card className="lg:col-span-2">
          <div className="relative h-96 rounded-lg overflow-hidden bg-neutral-100">
            {vehicle.primaryImageUrl ? (
              <Image
                src={vehicle.primaryImageUrl}
                alt={vehicle.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Car className="h-16 w-16 text-neutral-400" />
              </div>
            )}
            {vehicle.featured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-sm rounded-lg">
                Featured Vehicle
              </div>
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-neutral-900">Status</h3>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border`}>
                <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-neutral-900">Daily Rate</h3>
              <span className="text-2xl font-bold text-neutral-900">${vehicle.pricePerDay}</span>
            </div>
            <p className="text-sm text-neutral-600">Base price per day</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-neutral-900">Bookings</h3>
              <span className="text-2xl font-bold text-neutral-900">{vehicle.bookingsCount || 0}</span>
            </div>
            <p className="text-sm text-neutral-600">Total bookings</p>
          </Card>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specifications */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Make</p>
              <p className="font-medium">{vehicle.make}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Model</p>
              <p className="font-medium">{vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Year</p>
              <p className="font-medium">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Category</p>
              <p className="font-medium">{vehicle.category}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Transmission</p>
              <p className="font-medium">{vehicle.transmission}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Fuel Type</p>
              <p className="font-medium">{vehicle.fuelType}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Seats</p>
              <p className="font-medium">{vehicle.seats}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Doors</p>
              <p className="font-medium">{vehicle.doors}</p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Features</h3>
          <div className="grid grid-cols-1 gap-2">
            {(vehicle.features || []).map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Description</h3>
        <p className="text-neutral-700 leading-relaxed">{vehicle.description}</p>
      </Card>
    </div>
  )
}
