'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Car,
  DollarSign,
  Settings,
  Image as ImageIcon,
  FileText
} from 'lucide-react'
import { Button, Card, Input, Label } from '@valore/ui'
import Link from 'next/link'
import Image from 'next/image'

interface VehicleForm {
  // Basic Info
  displayName: string
  make: string
  model: string
  year: number
  trim: string
  vin: string
  licensePlate: string
  
  // Display
  slug: string
  description: string
  featured: boolean
  featuredOrder: number
  status: string
  
  // Categories
  category: string
  bodyType: string
  transmission: string
  fuelType: string
  drivetrain: string
  
  // Specifications
  seats: number
  doors: number
  engineSize: number
  engineType: string
  horsePower: number
  torque: number
  topSpeed: number
  acceleration: number
  fuelConsumption: number
  
  // Features
  features: string[]
  
  // Pricing
  pricePerDay: number
  weekendMultiplier: number
  weeklyDiscount: number
  monthlyDiscount: number
  minimumDays: number
  maximumDays: number
  includedKmPerDay: number
  extraKmPrice: number
  depositAmount: number
  
  // Images
  primaryImage: File | null
  galleryImages: File[]
}

const defaultFeatures = [
  'Bluetooth',
  'GPS Navigation',
  'Backup Camera',
  'Leather Seats',
  'Heated Seats',
  'Sunroof',
  'Apple CarPlay',
  'Android Auto',
  'Cruise Control',
  'Parking Sensors',
  'Lane Assist',
  'Keyless Entry',
  'USB Charging',
  'Climate Control',
  'Premium Sound System'
]

export default function NewVehiclePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'features' | 'pricing' | 'images'>('basic')
  
  const [form, setForm] = useState<VehicleForm>({
    displayName: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    trim: '',
    vin: '',
    licensePlate: '',
    slug: '',
    description: '',
    featured: false,
    featuredOrder: 0,
    status: 'ACTIVE',
    category: 'LUXURY',
    bodyType: 'SEDAN',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    drivetrain: 'RWD',
    seats: 5,
    doors: 4,
    engineSize: 2.0,
    engineType: '',
    horsePower: 0,
    torque: 0,
    topSpeed: 0,
    acceleration: 0,
    fuelConsumption: 0,
    features: [],
    pricePerDay: 0,
    weekendMultiplier: 1.2,
    weeklyDiscount: 10,
    monthlyDiscount: 20,
    minimumDays: 1,
    maximumDays: 30,
    includedKmPerDay: 200,
    extraKmPrice: 0.5,
    depositAmount: 500,
    primaryImage: null,
    galleryImages: []
  })

  const [primaryImagePreview, setPrimaryImagePreview] = useState<string>('')
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  const handleInputChange = (field: keyof VehicleForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from display name
    if (field === 'displayName') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setForm(prev => ({ ...prev, slug }))
    }
  }

  const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, primaryImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPrimaryImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...files] }))
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleFeatureToggle = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      
      // Add all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'primaryImage' || key === 'galleryImages') return
        if (key === 'features') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      })
      
      // Add images
      if (form.primaryImage) {
        formData.append('primaryImage', form.primaryImage)
      }
      form.galleryImages.forEach((image, index) => {
        formData.append(`galleryImage_${index}`, image)
      })
      
      // Make API call to create vehicle
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        router.push('/vehicles')
      }
    } catch (error) {
      console.error('Failed to create vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/vehicles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Add New Vehicle</h1>
            <p className="text-neutral-600 mt-1">Create a new vehicle in your fleet</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            leftIcon={<Save className="h-4 w-4" />}
          >
            {loading ? 'Creating...' : 'Create Vehicle'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg w-fit">
        {[
          { id: 'basic', label: 'Basic Info', icon: Car },
          { id: 'specs', label: 'Specifications', icon: Settings },
          { id: 'features', label: 'Features', icon: FileText },
          { id: 'pricing', label: 'Pricing', icon: DollarSign },
          { id: 'images', label: 'Images', icon: ImageIcon }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="e.g., Mercedes-AMG C43"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="mercedes-amg-c43"
              />
            </div>
            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={form.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="Mercedes-Benz"
              />
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={form.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="C43 AMG"
              />
            </div>
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={form.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="trim">Trim</Label>
              <Input
                id="trim"
                value={form.trim}
                onChange={(e) => handleInputChange('trim', e.target.value)}
                placeholder="AMG Line"
              />
            </div>
            <div>
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={form.vin}
                onChange={(e) => handleInputChange('vin', e.target.value)}
                placeholder="Vehicle Identification Number"
              />
            </div>
            <div>
              <Label htmlFor="licensePlate">License Plate *</Label>
              <Input
                id="licensePlate"
                value={form.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                placeholder="FLY-001"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="LUXURY">Luxury</option>
                <option value="SPORT">Sport</option>
                <option value="SUPERCAR">Supercar</option>
                <option value="SUV">SUV</option>
                <option value="CONVERTIBLE">Convertible</option>
                <option value="ELECTRIC">Electric</option>
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="COMING_SOON">Coming Soon</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Detailed description of the vehicle..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="featured" className="mb-0">Featured Vehicle</Label>
            </div>
            {form.featured && (
              <div>
                <Label htmlFor="featuredOrder">Featured Order</Label>
                <Input
                  id="featuredOrder"
                  type="number"
                  value={form.featuredOrder}
                  onChange={(e) => handleInputChange('featuredOrder', parseInt(e.target.value))}
                  placeholder="Display order (1, 2, 3...)"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Specifications Tab */}
      {activeTab === 'specs' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Vehicle Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="bodyType">Body Type</Label>
              <select
                id="bodyType"
                value={form.bodyType}
                onChange={(e) => handleInputChange('bodyType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="SEDAN">Sedan</option>
                <option value="COUPE">Coupe</option>
                <option value="CONVERTIBLE">Convertible</option>
                <option value="SUV">SUV</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="WAGON">Wagon</option>
              </select>
            </div>
            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <select
                id="transmission"
                value={form.transmission}
                onChange={(e) => handleInputChange('transmission', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
                <option value="SEMI_AUTOMATIC">Semi-Automatic</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <select
                id="fuelType"
                value={form.fuelType}
                onChange={(e) => handleInputChange('fuelType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ELECTRIC">Electric</option>
                <option value="PLUG_IN_HYBRID">Plug-in Hybrid</option>
              </select>
            </div>
            <div>
              <Label htmlFor="drivetrain">Drivetrain</Label>
              <select
                id="drivetrain"
                value={form.drivetrain}
                onChange={(e) => handleInputChange('drivetrain', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
                <option value="FOUR_WD">4WD</option>
              </select>
            </div>
            <div>
              <Label htmlFor="seats">Seats</Label>
              <Input
                id="seats"
                type="number"
                value={form.seats}
                onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="doors">Doors</Label>
              <Input
                id="doors"
                type="number"
                value={form.doors}
                onChange={(e) => handleInputChange('doors', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="engineSize">Engine Size (L)</Label>
              <Input
                id="engineSize"
                type="number"
                step="0.1"
                value={form.engineSize}
                onChange={(e) => handleInputChange('engineSize', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="engineType">Engine Type</Label>
              <Input
                id="engineType"
                value={form.engineType}
                onChange={(e) => handleInputChange('engineType', e.target.value)}
                placeholder="e.g., V6 Turbo"
              />
            </div>
            <div>
              <Label htmlFor="horsePower">Horsepower</Label>
              <Input
                id="horsePower"
                type="number"
                value={form.horsePower}
                onChange={(e) => handleInputChange('horsePower', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="torque">Torque (Nm)</Label>
              <Input
                id="torque"
                type="number"
                value={form.torque}
                onChange={(e) => handleInputChange('torque', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="topSpeed">Top Speed (km/h)</Label>
              <Input
                id="topSpeed"
                type="number"
                value={form.topSpeed}
                onChange={(e) => handleInputChange('topSpeed', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="acceleration">0-100 km/h (seconds)</Label>
              <Input
                id="acceleration"
                type="number"
                step="0.1"
                value={form.acceleration}
                onChange={(e) => handleInputChange('acceleration', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="fuelConsumption">Fuel Consumption (L/100km)</Label>
              <Input
                id="fuelConsumption"
                type="number"
                step="0.1"
                value={form.fuelConsumption}
                onChange={(e) => handleInputChange('fuelConsumption', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Vehicle Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {defaultFeatures.map(feature => (
              <label
                key={feature}
                className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={form.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded"
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
          <div className="mt-6">
            <Label>Custom Features</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom feature..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement
                    if (input.value) {
                      handleFeatureToggle(input.value)
                      input.value = ''
                    }
                  }
                }}
              />
              <Button variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.features.filter(f => !defaultFeatures.includes(f)).map(feature => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm flex items-center gap-2"
                >
                  {feature}
                  <button
                    onClick={() => handleFeatureToggle(feature)}
                    className="hover:text-amber-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Pricing & Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pricePerDay">Price per Day ($) *</Label>
              <Input
                id="pricePerDay"
                type="number"
                value={form.pricePerDay}
                onChange={(e) => handleInputChange('pricePerDay', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="depositAmount">Security Deposit ($) *</Label>
              <Input
                id="depositAmount"
                type="number"
                value={form.depositAmount}
                onChange={(e) => handleInputChange('depositAmount', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="weekendMultiplier">Weekend Multiplier</Label>
              <Input
                id="weekendMultiplier"
                type="number"
                step="0.1"
                value={form.weekendMultiplier}
                onChange={(e) => handleInputChange('weekendMultiplier', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
              <Input
                id="weeklyDiscount"
                type="number"
                value={form.weeklyDiscount}
                onChange={(e) => handleInputChange('weeklyDiscount', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="monthlyDiscount">Monthly Discount (%)</Label>
              <Input
                id="monthlyDiscount"
                type="number"
                value={form.monthlyDiscount}
                onChange={(e) => handleInputChange('monthlyDiscount', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="minimumDays">Minimum Rental Days</Label>
              <Input
                id="minimumDays"
                type="number"
                value={form.minimumDays}
                onChange={(e) => handleInputChange('minimumDays', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="maximumDays">Maximum Rental Days</Label>
              <Input
                id="maximumDays"
                type="number"
                value={form.maximumDays}
                onChange={(e) => handleInputChange('maximumDays', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="includedKmPerDay">Included KM per Day</Label>
              <Input
                id="includedKmPerDay"
                type="number"
                value={form.includedKmPerDay}
                onChange={(e) => handleInputChange('includedKmPerDay', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="extraKmPrice">Extra KM Price ($)</Label>
              <Input
                id="extraKmPrice"
                type="number"
                step="0.01"
                value={form.extraKmPrice}
                onChange={(e) => handleInputChange('extraKmPrice', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Primary Image</h2>
            <div className="space-y-4">
              {primaryImagePreview ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-neutral-100">
                  <Image
                    src={primaryImagePreview}
                    alt="Primary vehicle image"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => {
                      setPrimaryImagePreview('')
                      setForm(prev => ({ ...prev, primaryImage: null }))
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                  <span className="text-sm text-neutral-600">Click to upload primary image</span>
                  <span className="text-xs text-neutral-500 mt-1">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePrimaryImageChange}
                  />
                </label>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Gallery Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100">
                  <Image
                    src={preview}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-video border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 flex flex-col items-center justify-center">
                <Plus className="h-6 w-6 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-600">Add Images</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                />
              </label>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

