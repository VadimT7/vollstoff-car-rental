'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button, Card, Input, Textarea } from '@valore/ui'
import { 
  ArrowLeft, 
  ArrowRight,
  Save, 
  Upload, 
  X, 
  Plus,
  Star,
  Info,
  Check,
  AlertCircle,
  Car,
  Settings,
  DollarSign,
  Camera,
  Trash2
} from 'lucide-react'
import Image from 'next/image'

interface FormData {
  // Basic Info
  displayName: string
  slug: string
  make: string
  model: string
  year: number
  trim: string
  vin: string | null
  licensePlate: string | null
  category: string
  status: string
  description: string
  featured: boolean
  featuredOrder: number
  
  // Specifications
  bodyType: string
  transmission: string
  fuelType: string
  drivetrain: string
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
  currentPrimaryImageUrl?: string
  currentGalleryImages?: string[]
}

const steps = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'specs', label: 'Specifications', icon: Settings },
  { id: 'features', label: 'Features', icon: Star },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'images', label: 'Images', icon: Camera }
]

const initialFormData: FormData = {
  displayName: '',
  slug: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  trim: '',
  vin: '',
  licensePlate: '',
  category: 'LUXURY',
  status: 'ACTIVE',
  description: '',
  featured: false,
  featuredOrder: 0,
  bodyType: 'SEDAN',
  transmission: 'AUTOMATIC',
  fuelType: 'PETROL',
  drivetrain: 'RWD',
  seats: 5,
  doors: 4,
  engineSize: 2.0,
  engineType: 'Turbocharged',
  horsePower: 300,
  torque: 400,
  topSpeed: 250,
  acceleration: 5.5,
  fuelConsumption: 8.5,
  features: [],
  pricePerDay: 500,
  weekendMultiplier: 1.2,
  weeklyDiscount: 0.1,
  monthlyDiscount: 0.2,
  minimumDays: 1,
  maximumDays: 30,
  includedKmPerDay: 200,
  extraKmPrice: 0.5,
  depositAmount: 500,
  primaryImage: null,
  galleryImages: []
}

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string
  
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Load existing vehicle data
  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        console.log('🔍 Loading vehicle data for ID:', vehicleId)
        
        // Reset form state first
        setForm(initialFormData)
        setErrors({})
        setCurrentStep(0)
        setInitialLoading(true)
        
        const response = await fetch(`/api/vehicles?id=${vehicleId}`)
        if (response.ok) {
          const vehicleArray = await response.json()
          console.log('📋 Raw API response:', vehicleArray)
          const vehicle = vehicleArray[0] // API returns array, take first item
          
          if (!vehicle) {
            console.error('❌ Vehicle not found')
            router.push('/fleet')
            return
          }
          
          console.log('✅ Vehicle data loaded for ID:', vehicleId, 'Vehicle:', vehicle.displayName)
          
          // Populate form with existing data
          setForm({
            displayName: vehicle.displayName || '',
            slug: vehicle.slug || '',
            make: vehicle.make || '',
            model: vehicle.model || '',
            year: vehicle.year || new Date().getFullYear(),
            trim: vehicle.trim || '',
            vin: vehicle.vin || '',
            licensePlate: vehicle.licensePlate || '',
            category: vehicle.category || 'LUXURY',
            status: vehicle.status || 'ACTIVE',
            description: vehicle.description || '',
            featured: vehicle.featured || false,
            featuredOrder: vehicle.featuredOrder || 0,
            bodyType: vehicle.bodyType || 'SEDAN',
            transmission: vehicle.transmission || 'AUTOMATIC',
            fuelType: vehicle.fuelType || 'PETROL',
            drivetrain: vehicle.drivetrain || 'RWD',
            seats: vehicle.seats || 5,
            doors: vehicle.doors || 4,
            engineSize: vehicle.engineSize || 2.0,
            engineType: vehicle.engineType || 'Turbocharged',
            horsePower: vehicle.horsePower || 300,
            torque: vehicle.torque || 400,
            topSpeed: vehicle.topSpeed || 250,
            acceleration: vehicle.acceleration || 5.5,
            fuelConsumption: vehicle.fuelConsumption || 8.5,
            features: vehicle.features || [],
            pricePerDay: vehicle.priceRules?.[0]?.basePricePerDay ? Number(vehicle.priceRules[0].basePricePerDay) : 500,
            weekendMultiplier: vehicle.priceRules?.[0]?.weekendMultiplier ? Number(vehicle.priceRules[0].weekendMultiplier) : 1.2,
            weeklyDiscount: vehicle.priceRules?.[0]?.weeklyDiscount ? Number(vehicle.priceRules[0].weeklyDiscount) : 0.1,
            monthlyDiscount: vehicle.priceRules?.[0]?.monthlyDiscount ? Number(vehicle.priceRules[0].monthlyDiscount) : 0.2,
            minimumDays: vehicle.priceRules?.[0]?.minimumDays || 1,
            maximumDays: vehicle.priceRules?.[0]?.maximumDays || 30,
            includedKmPerDay: vehicle.priceRules?.[0]?.includedKmPerDay || 200,
            extraKmPrice: vehicle.priceRules?.[0]?.extraKmPrice ? Number(vehicle.priceRules[0].extraKmPrice) : 0.5,
            depositAmount: vehicle.priceRules?.[0]?.depositAmount ? Number(vehicle.priceRules[0].depositAmount) : 500,
            primaryImage: null,
            galleryImages: [],
            currentPrimaryImageUrl: vehicle.primaryImageUrl || '',
            currentGalleryImages: vehicle.images?.map((img: any) => img.url) || []
          })
        } else {
          console.error('❌ Failed to load vehicle:', response.status)
          router.push('/fleet')
        }
      } catch (error) {
        console.error('❌ Failed to load vehicle:', error)
        router.push('/fleet')
      } finally {
        setInitialLoading(false)
      }
    }

    if (vehicleId) {
      loadVehicleData()
    }
  }, [vehicleId])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Auto-generate slug from display name
    if (field === 'displayName') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setForm(prev => ({ ...prev, slug }))
    }
  }

  const handleImageUpload = (file: File, type: 'primary' | 'gallery') => {
    if (type === 'primary') {
      setForm(prev => ({ ...prev, primaryImage: file }))
    } else {
      setForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, file] }))
    }
  }

  const removeGalleryImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (stepIndex) {
      case 0: // Basic Info
        if (!form.displayName.trim()) newErrors.displayName = 'Display name is required'
        if (!form.make.trim()) newErrors.make = 'Make is required'
        if (!form.model.trim()) newErrors.model = 'Model is required'
        if (form.year < 1900 || form.year > new Date().getFullYear() + 2) newErrors.year = 'Invalid year'
        break
      case 1: // Specifications
        if (form.horsePower < 50) newErrors.horsePower = 'Horsepower must be at least 50'
        break
      case 3: // Pricing
        if (form.pricePerDay <= 0) newErrors.pricePerDay = 'Price per day must be greater than 0'
        if (form.depositAmount < 0) newErrors.depositAmount = 'Deposit cannot be negative'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    // Validate all steps
    let allValid = true
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false
        break
      }
    }
    
    if (!allValid) {
      alert('Please complete all required fields')
      return
    }
    
    setLoading(true)
    
    try {
      const formData = new FormData()
      
      // Add all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'features') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'primaryImage') {
          if (value) formData.append(key, value)
        } else if (key === 'galleryImages') {
          value.forEach((file: File, index: number) => {
            formData.append(`galleryImage_${index}`, file)
          })
        } else if (key !== 'currentPrimaryImageUrl' && key !== 'currentGalleryImages') {
          formData.append(key, String(value))
        }
      })

      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        alert('Vehicle updated successfully!')
        router.push('/fleet')
      } else {
        const errorData = await response.json()
        alert(`Failed to update vehicle: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Failed to update vehicle. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          alert('Vehicle deleted successfully!')
          router.push('/fleet')
        } else {
          alert('Failed to delete vehicle')
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        alert('Failed to delete vehicle')
      }
    }
  }

  const addFeature = (feature: string) => {
    if (feature && !form.features.includes(feature)) {
      setForm(prev => ({ ...prev, features: [...prev.features, feature] }))
    }
  }

  const removeFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const availableFeatures = [
    'Air Conditioning', 'Navigation System', 'Bluetooth', 'USB Charging',
    'Wireless Charging', 'Premium Sound System', 'Sunroof', 'Leather Seats',
    'Heated Seats', 'Ventilated Seats', 'Parking Sensors', 'Backup Camera',
    'Blind Spot Monitoring', 'Lane Departure Warning', 'Adaptive Cruise Control',
    'Keyless Entry', 'Push Button Start', 'Remote Start', 'Tinted Windows',
    'Sport Mode', 'Eco Mode', 'All-Wheel Drive', 'Performance Exhaust',
    'Carbon Fiber Interior', 'Ambient Lighting', 'Head-Up Display',
    'Massage Seats', 'Premium Leather', 'Wood Trim', 'Alcantara'
  ]

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Display Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            placeholder="Mercedes-AMG C43"
            className={errors.displayName ? 'border-red-500' : ''}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.displayName}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="mercedes-amg-c43"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Make <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.make}
            onChange={(e) => handleInputChange('make', e.target.value)}
            placeholder="Mercedes-Benz"
            className={errors.make ? 'border-red-500' : ''}
          />
          {errors.make && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.make}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Model <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            placeholder="C43 AMG"
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.model}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Year <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={form.year}
            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
            min={1900}
            max={new Date().getFullYear() + 2}
            className={errors.year ? 'border-red-500' : ''}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.year}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Trim
          </label>
          <Input
            value={form.trim}
            onChange={(e) => handleInputChange('trim', e.target.value)}
            placeholder="AMG Line"
          />
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="LUXURY">Luxury</option>
            <option value="SUV">SUV</option>
            <option value="SPORTS">Sports</option>
            <option value="SEDAN">Sedan</option>
            <option value="CONVERTIBLE">Convertible</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={form.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="RETIRED">Retired</option>
            <option value="COMING_SOON">Coming Soon</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded border-neutral-300"
            />
            <span className="text-sm font-medium text-neutral-700">Featured Vehicle</span>
          </label>
          {form.featured && (
            <div className="mt-2">
              <label className="block text-sm text-neutral-600 mb-1">Featured Order</label>
              <Input
                type="number"
                value={form.featuredOrder}
                onChange={(e) => handleInputChange('featuredOrder', parseInt(e.target.value))}
                min={0}
                className="w-32"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description
        </label>
        <Textarea
          value={form.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe this luxury vehicle..."
          rows={4}
        />
      </div>
    </div>
  )

  const renderSpecifications = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Body Type
          </label>
          <select
            value={form.bodyType}
            onChange={(e) => handleInputChange('bodyType', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="COUPE">Coupe</option>
            <option value="CONVERTIBLE">Convertible</option>
            <option value="HATCHBACK">Hatchback</option>
            <option value="WAGON">Wagon</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Transmission
          </label>
          <select
            value={form.transmission}
            onChange={(e) => handleInputChange('transmission', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Fuel Type
          </label>
          <select
            value={form.fuelType}
            onChange={(e) => handleInputChange('fuelType', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Drivetrain
          </label>
          <select
            value={form.drivetrain}
            onChange={(e) => handleInputChange('drivetrain', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="RWD">RWD</option>
            <option value="FWD">FWD</option>
            <option value="AWD">AWD</option>
            <option value="FOUR_WD">4WD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Seats
          </label>
          <Input
            type="number"
            value={form.seats}
            onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
            min={2}
            max={8}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Doors
          </label>
          <Input
            type="number"
            value={form.doors}
            onChange={(e) => handleInputChange('doors', parseInt(e.target.value))}
            min={2}
            max={5}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Engine Size (L)
          </label>
          <Input
            type="number"
            step="0.1"
            value={form.engineSize}
            onChange={(e) => handleInputChange('engineSize', parseFloat(e.target.value))}
            min={0.5}
            max={10}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Engine Type
          </label>
          <Input
            value={form.engineType}
            onChange={(e) => handleInputChange('engineType', e.target.value)}
            placeholder="Turbocharged"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Horsepower <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={form.horsePower}
            onChange={(e) => handleInputChange('horsePower', parseInt(e.target.value))}
            min={50}
            max={2000}
            className={errors.horsePower ? 'border-red-500' : ''}
          />
          {errors.horsePower && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.horsePower}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Torque (Nm)
          </label>
          <Input
            type="number"
            value={form.torque}
            onChange={(e) => handleInputChange('torque', parseInt(e.target.value))}
            min={0}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Top Speed (km/h)
          </label>
          <Input
            type="number"
            value={form.topSpeed}
            onChange={(e) => handleInputChange('topSpeed', parseInt(e.target.value))}
            min={0}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            0-100 km/h (s)
          </label>
          <Input
            type="number"
            step="0.1"
            value={form.acceleration}
            onChange={(e) => handleInputChange('acceleration', parseFloat(e.target.value))}
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Fuel Consumption (L/100km)
        </label>
        <Input
          type="number"
          step="0.1"
          value={form.fuelConsumption}
          onChange={(e) => handleInputChange('fuelConsumption', parseFloat(e.target.value))}
          min={0}
          className="w-32"
        />
      </div>
    </div>
  )

  const renderFeatures = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Select Features
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableFeatures.map((feature) => (
            <button
              key={feature}
              onClick={() => addFeature(feature)}
              disabled={form.features.includes(feature)}
              className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <Plus className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">{feature}</span>
            </button>
          ))}
        </div>
      </div>

      {form.features.length > 0 && (
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Selected Features</h4>
          <div className="flex flex-wrap gap-2">
            {form.features.map((feature, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm flex items-center gap-2"
              >
                <span>{feature}</span>
                <button
                  onClick={() => removeFeature(index)}
                  className="text-amber-600 hover:text-amber-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Base Price Per Day <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={form.pricePerDay}
            onChange={(e) => handleInputChange('pricePerDay', parseFloat(e.target.value))}
            min={0}
            step={0.01}
            className={errors.pricePerDay ? 'border-red-500' : ''}
          />
          {errors.pricePerDay && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.pricePerDay}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Deposit Amount <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={form.depositAmount}
            onChange={(e) => handleInputChange('depositAmount', parseFloat(e.target.value))}
            min={0}
            step={0.01}
            className={errors.depositAmount ? 'border-red-500' : ''}
          />
          {errors.depositAmount && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.depositAmount}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Weekend Multiplier
          </label>
          <Input
            type="number"
            value={form.weekendMultiplier}
            onChange={(e) => handleInputChange('weekendMultiplier', parseFloat(e.target.value))}
            min={1}
            step={0.1}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Weekly Discount (%)
          </label>
          <Input
            type="number"
            value={form.weeklyDiscount * 100}
            onChange={(e) => handleInputChange('weeklyDiscount', parseFloat(e.target.value) / 100)}
            min={0}
            max={50}
            step={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Monthly Discount (%)
          </label>
          <Input
            type="number"
            value={form.monthlyDiscount * 100}
            onChange={(e) => handleInputChange('monthlyDiscount', parseFloat(e.target.value) / 100)}
            min={0}
            max={50}
            step={1}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Extra KM Price (per km)
          </label>
          <Input
            type="number"
            value={form.extraKmPrice}
            onChange={(e) => handleInputChange('extraKmPrice', parseFloat(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Minimum Days
          </label>
          <Input
            type="number"
            value={form.minimumDays}
            onChange={(e) => handleInputChange('minimumDays', parseInt(e.target.value))}
            min={1}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Maximum Days
          </label>
          <Input
            type="number"
            value={form.maximumDays}
            onChange={(e) => handleInputChange('maximumDays', parseInt(e.target.value))}
            min={1}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Included KM/Day
          </label>
          <Input
            type="number"
            value={form.includedKmPerDay}
            onChange={(e) => handleInputChange('includedKmPerDay', parseInt(e.target.value))}
            min={0}
          />
        </div>
      </div>
    </div>
  )

  const renderImages = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Primary Image
        </label>
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
          {form.primaryImage ? (
            <div className="relative">
              <Image
                src={URL.createObjectURL(form.primaryImage)}
                alt="Primary image preview"
                width={200}
                height={120}
                className="mx-auto rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('primaryImage', null)}
                className="mt-2"
                leftIcon={<X className="h-4 w-4" />}
              >
                Remove
              </Button>
            </div>
          ) : form.currentPrimaryImageUrl ? (
            <div className="relative">
              <Image
                src={form.currentPrimaryImageUrl}
                alt="Current primary image"
                width={200}
                height={120}
                className="mx-auto rounded-lg object-cover"
              />
              <p className="text-sm text-neutral-600 mt-2">Current Image</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'primary')
                }}
                className="hidden"
                id="primary-image-replace"
              />
              <label
                htmlFor="primary-image-replace"
                className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 cursor-pointer mt-2"
              >
                Replace Image
              </label>
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-2">Upload primary image</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'primary')
                }}
                className="hidden"
                id="primary-image"
              />
              <label
                htmlFor="primary-image"
                className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 cursor-pointer"
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Gallery Images
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {form.galleryImages.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Gallery ${index + 1}`}
                width={150}
                height={100}
                className="rounded-lg object-cover"
              />
              <button
                onClick={() => removeGalleryImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 flex items-center justify-center min-h-[100px]">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file, 'gallery')
              }}
              className="hidden"
              id="gallery-image"
            />
            <label
              htmlFor="gallery-image"
              className="cursor-pointer text-neutral-400 hover:text-neutral-600"
            >
              <Plus className="h-6 w-6" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo()
      case 1: return renderSpecifications()
      case 2: return renderFeatures()
      case 3: return renderPricing()
      case 4: return renderImages()
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Edit Vehicle</h1>
            <p className="text-neutral-600 mt-1">Update vehicle information and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleDelete} 
            className="text-red-600"
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-amber-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-neutral-200 text-neutral-600'
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-amber-600' : 
                    isCompleted ? 'text-green-600' : 
                    'text-neutral-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-600' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            {(() => {
              const Icon = steps[currentStep].icon
              return <Icon className="h-5 w-5 text-amber-600" />
            })()}
            {steps[currentStep].label}
          </h2>
        </div>

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              leftIcon={loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}