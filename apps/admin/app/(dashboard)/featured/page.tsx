'use client'

import { useState, useEffect } from 'react'
import { 
  Star,
  Car,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Button, Card } from '@valore/ui'
import Image from 'next/image'

interface Vehicle {
  id: string
  displayName: string
  slug: string
  category: string
  primaryImageUrl: string
  featured: boolean
  featuredOrder: number
  status: string
  pricePerDay: number
}

export default function FeaturedFleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Vehicle | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      
      const featured = data.filter((v: Vehicle) => v.featured).sort((a: Vehicle, b: Vehicle) => a.featuredOrder - b.featuredOrder)
      const available = data.filter((v: Vehicle) => !v.featured && v.status === 'ACTIVE')
      
      setVehicles(featured)
      setAvailableVehicles(available)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
      setLoading(false)
    }
  }

  const handleAddToFeatured = async (vehicle: Vehicle) => {
    const newOrder = vehicles.length + 1
    const updatedVehicle = { ...vehicle, featured: true, featuredOrder: newOrder }
    
    try {
      const response = await fetch('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vehicle.id,
          featured: true,
          featuredOrder: newOrder
        })
      })
      
      if (response.ok) {
        setVehicles([...vehicles, updatedVehicle])
        setAvailableVehicles(availableVehicles.filter(v => v.id !== vehicle.id))
      }
    } catch (error) {
      console.error('Failed to update vehicle:', error)
    }
  }

  const handleRemoveFromFeatured = async (vehicle: Vehicle) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vehicle.id,
          featured: false,
          featuredOrder: 0
        })
      })
      
      if (response.ok) {
        setVehicles(vehicles.filter(v => v.id !== vehicle.id))
        setAvailableVehicles([...availableVehicles, { ...vehicle, featured: false, featuredOrder: 0 }])
      }
    } catch (error) {
      console.error('Failed to update vehicle:', error)
    }
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newVehicles = [...vehicles]
    const [movedItem] = newVehicles.splice(fromIndex, 1)
    newVehicles.splice(toIndex, 0, movedItem)
    
    // Update order numbers
    const updatedVehicles = newVehicles.map((v, index) => ({
      ...v,
      featuredOrder: index + 1
    }))
    
    setVehicles(updatedVehicles)
  }

  const handleSaveOrder = async () => {
    setSaving(true)
    
    try {
      // Update all featured vehicles with new order
      await Promise.all(
        vehicles.map(vehicle => 
          fetch('/api/vehicles', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: vehicle.id,
              featuredOrder: vehicle.featuredOrder
            })
          })
        )
      )
      
      setSaving(false)
    } catch (error) {
      console.error('Failed to save order:', error)
      setSaving(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, vehicle: Vehicle) => {
    setDraggedItem(vehicle)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetVehicle: Vehicle) => {
    e.preventDefault()
    
    if (draggedItem && draggedItem.id !== targetVehicle.id) {
      const draggedIndex = vehicles.findIndex(v => v.id === draggedItem.id)
      const targetIndex = vehicles.findIndex(v => v.id === targetVehicle.id)
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        handleReorder(draggedIndex, targetIndex)
      }
    }
    
    setDraggedItem(null)
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
          <h1 className="text-3xl font-bold text-neutral-900">Featured Fleet Management</h1>
          <p className="text-neutral-600 mt-2">Manage which vehicles appear in the featured section</p>
        </div>
        <Button 
          onClick={handleSaveOrder} 
          disabled={saving} 
          leftIcon={<Save className="h-4 w-4" />}
        >
          {saving ? 'Saving...' : 'Save Order'}
        </Button>
      </div>

      {/* Featured Fleet Guidelines */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <Star className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 mb-1">Featured Fleet Guidelines</p>
            <ul className="space-y-1 text-amber-700">
              <li>• Maximum of 6 vehicles can be featured at once</li>
              <li>• Drag and drop to reorder featured vehicles</li>
              <li>• Featured vehicles appear on the homepage</li>
              <li>• Only active vehicles can be featured</li>
              <li>• Remember to save after reordering</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Featured Vehicles</p>
              <p className="text-2xl font-bold text-neutral-900">{vehicles.length}</p>
            </div>
            <Star className="h-8 w-8 text-amber-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Available to Feature</p>
              <p className="text-2xl font-bold text-neutral-900">{availableVehicles.length}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Max Featured</p>
              <p className="text-2xl font-bold text-neutral-900">6</p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Featured Vehicles */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Featured Vehicles</h2>
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600">No featured vehicles yet</p>
            <p className="text-sm text-neutral-500 mt-1">Add vehicles from the available list below</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                draggable
                onDragStart={(e) => handleDragStart(e, vehicle)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, vehicle)}
                className="flex items-center gap-4 p-4 bg-white border rounded-lg cursor-move hover:shadow-md transition-shadow"
              >
                <GripVertical className="h-5 w-5 text-neutral-400" />
                
                <div className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 font-bold rounded-full">
                  {vehicle.featuredOrder}
                </div>
                
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
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{vehicle.displayName}</p>
                  <p className="text-sm text-neutral-600">{vehicle.category} • ${vehicle.pricePerDay}/day</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (index > 0) handleReorder(index, index - 1)
                    }}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (index < vehicles.length - 1) handleReorder(index, index + 1)
                    }}
                    disabled={index === vehicles.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFromFeatured(vehicle)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Available Vehicles */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Available Vehicles</h2>
        {availableVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600">All active vehicles are featured</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableVehicles.map(vehicle => (
              <div
                key={vehicle.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50"
              >
                <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-neutral-100">
                  {vehicle.primaryImageUrl ? (
                    <Image
                      src={vehicle.primaryImageUrl}
                      alt={vehicle.displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car className="h-4 w-4 text-neutral-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-sm text-neutral-900">{vehicle.displayName}</p>
                  <p className="text-xs text-neutral-600">{vehicle.category}</p>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddToFeatured(vehicle)}
                  disabled={vehicles.length >= 6}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  )
}

