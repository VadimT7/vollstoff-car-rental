'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  Camera
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
}

interface ValidationErrors {
  [key: string]: string
}

const initialFormData: FormData = {
  displayName: '',
  slug: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  trim: '',
  vin: null,
  licensePlate: null,
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
  pricePerDay: 0,
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

const steps = [
  { id: 'basic', title: 'Basic Information', icon: Car, description: 'Vehicle details and identification' },
  { id: 'specs', title: 'Specifications', icon: Settings, description: 'Technical specifications and performance' },
  { id: 'features', title: 'Features', icon: Star, description: 'Available features and amenities' },
  { id: 'pricing', title: 'Pricing', icon: DollarSign, description: 'Pricing rules and rates' },
  { id: 'images', title: 'Images', icon: Camera, description: 'Photos and media' }
]

const categories = [
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'SUV', label: 'SUV' },
  { value: 'SUPERCAR', label: 'Supercar' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'ECONOMY', label: 'Economy' }
]

const bodyTypes = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'COUPE', label: 'Coupe' },
  { value: 'CONVERTIBLE', label: 'Convertible' },
  { value: 'SUV', label: 'SUV' },
  { value: 'WAGON', label: 'Wagon' },
  { value: 'HATCHBACK', label: 'Hatchback' }
]

const transmissions = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'SEMI_AUTOMATIC', label: 'Semi-Automatic' }
]

const fuelTypes = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'PLUG_IN_HYBRID', label: 'Plug-in Hybrid' }
]

const drivetrains = [
  { value: 'FWD', label: 'Front Wheel Drive' },
  { value: 'RWD', label: 'Rear Wheel Drive' },
  { value: 'AWD', label: 'All Wheel Drive' },
  { value: 'FOUR_WD', label: '4 Wheel Drive' }
]

const commonFeatures = [
  'Air Conditioning',
  'Heated Seats',
  'Leather Interior',
  'Sunroof',
  'Navigation System',
  'Bluetooth',
  'Backup Camera',
  'Parking Sensors',
  'Cruise Control',
  'Premium Sound System',
  'Keyless Entry',
  'Remote Start',
  'Lane Departure Warning',
  'Blind Spot Monitoring',
  'Adaptive Cruise Control'
]

export default function NewVehiclePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Auto-generate slug from display name
    if (field === 'displayName') {
      const slug = generateSlug(value)
      setForm(prev => ({ ...prev, slug }))
    }
  }

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: ValidationErrors = {}
    
    switch (stepIndex) {
      case 0: // Basic Information
        if (!form.displayName.trim()) newErrors.displayName = 'Display name is required'
        if (!form.make.trim()) newErrors.make = 'Make is required'
        if (!form.model.trim()) newErrors.model = 'Model is required'
        if (!form.year || form.year < 1900 || form.year > new Date().getFullYear() + 2) {
          newErrors.year = 'Valid year is required'
        }
        break
        
      case 1: // Specifications
        if (!form.seats || form.seats < 1 || form.seats > 20) newErrors.seats = 'Valid seat count required'
        if (!form.doors || form.doors < 2 || form.doors > 6) newErrors.doors = 'Valid door count required'
        if (!form.engineSize || form.engineSize < 0.5 || form.engineSize > 10) {
          newErrors.engineSize = 'Valid engine size required'
        }
        if (!form.horsePower || form.horsePower < 50 || form.horsePower > 2000) {
          newErrors.horsePower = 'Valid horsepower required'
        }
        break
        
      case 2: // Features (optional)
        break
        
      case 3: // Pricing
        if (!form.pricePerDay || form.pricePerDay <= 0) newErrors.pricePerDay = 'Price per day is required'
        if (!form.depositAmount || form.depositAmount < 0) newErrors.depositAmount = 'Deposit amount is required'
        break
        
      case 4: // Images (optional but recommended)
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set([...Array.from(prev), currentStep]))
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    // Only allow going to previous steps or next step if current is valid
    if (stepIndex <= currentStep || validateStep(currentStep)) {
      setCurrentStep(stepIndex)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
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

  const generateSlug = (displayName: string) => {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
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
        } else {
          formData.append(key, String(value))
        }
      })
      
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        router.push('/fleet')
      } else {
        const errorData = await response.json()
        console.error('Vehicle creation failed:', errorData)
        const errorMessage = errorData.details || errorData.error || 'Unknown error'
        alert(`Failed to create vehicle: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error creating vehicle:', error)
      alert('Failed to create vehicle')
    } finally {
      setLoading(false)
    }
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
            placeholder="e.g., Mercedes-AMG C43"
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
            URL Slug
          </label>
          <Input
            value={form.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="mercedes-amg-c43"
          />
          <p className="text-xs text-neutral-500 mt-1">Auto-generated from display name</p>
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
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description
        </label>
        <Textarea
          value={form.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the vehicle..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
            className="mr-2"
          />
          Featured Vehicle
        </label>
        
        {form.featured && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Featured Order
            </label>
            <Input
              type="number"
              value={form.featuredOrder}
              onChange={(e) => handleInputChange('featuredOrder', parseInt(e.target.value))}
              min={0}
              className="w-20"
            />
          </div>
        )}
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
            {bodyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
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
            {transmissions.map((trans) => (
              <option key={trans.value} value={trans.value}>
                {trans.label}
              </option>
            ))}
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
            {fuelTypes.map((fuel) => (
              <option key={fuel.value} value={fuel.value}>
                {fuel.label}
              </option>
            ))}
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
            {drivetrains.map((drive) => (
              <option key={drive.value} value={drive.value}>
                {drive.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Seats <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={form.seats}
            onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
            min={1}
            max={20}
            className={errors.seats ? 'border-red-500' : ''}
          />
          {errors.seats && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.seats}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Doors <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={form.doors}
            onChange={(e) => handleInputChange('doors', parseInt(e.target.value))}
            min={2}
            max={6}
            className={errors.doors ? 'border-red-500' : ''}
          />
          {errors.doors && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.doors}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Engine Size (L) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.1"
            value={form.engineSize}
            onChange={(e) => handleInputChange('engineSize', parseFloat(e.target.value))}
            min={0.5}
            max={10}
            className={errors.engineSize ? 'border-red-500' : ''}
          />
          {errors.engineSize && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.engineSize}
            </p>
          )}
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
        <h4 className="text-lg font-medium text-neutral-900 mb-4">Select Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commonFeatures.map((feature) => (
            <label key={feature} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-neutral-50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-neutral-700">{feature}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Selected Features ({form.features.length}):</p>
        {form.features.length > 0 ? (
          <p>{form.features.join(', ')}</p>
        ) : (
          <p className="text-neutral-400">No features selected</p>
        )}
      </div>
    </div>
  )

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Price Per Day ($) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={form.pricePerDay}
            onChange={(e) => handleInputChange('pricePerDay', parseFloat(e.target.value))}
            min={0}
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
            Deposit Amount ($) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={form.depositAmount}
            onChange={(e) => handleInputChange('depositAmount', parseFloat(e.target.value))}
            min={0}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Weekend Multiplier
          </label>
          <Input
            type="number"
            step="0.1"
            value={form.weekendMultiplier}
            onChange={(e) => handleInputChange('weekendMultiplier', parseFloat(e.target.value))}
            min={1}
            max={3}
          />
          <p className="text-xs text-neutral-500 mt-1">Default: 1.2 (20% increase)</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Weekly Discount
          </label>
          <Input
            type="number"
            step="0.01"
            value={form.weeklyDiscount}
            onChange={(e) => handleInputChange('weeklyDiscount', parseFloat(e.target.value))}
            min={0}
            max={0.5}
          />
          <p className="text-xs text-neutral-500 mt-1">Default: 0.1 (10% discount)</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Monthly Discount
          </label>
          <Input
            type="number"
            step="0.01"
            value={form.monthlyDiscount}
            onChange={(e) => handleInputChange('monthlyDiscount', parseFloat(e.target.value))}
            min={0}
            max={0.5}
          />
          <p className="text-xs text-neutral-500 mt-1">Default: 0.2 (20% discount)</p>
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
            Included KM per Day
          </label>
          <Input
            type="number"
            value={form.includedKmPerDay}
            onChange={(e) => handleInputChange('includedKmPerDay', parseInt(e.target.value))}
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Extra KM Price ($/km)
        </label>
        <Input
          type="number"
          step="0.01"
          value={form.extraKmPrice}
          onChange={(e) => handleInputChange('extraKmPrice', parseFloat(e.target.value))}
          min={0}
          className="w-32"
        />
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
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
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
                alt={`Gallery image ${index + 1}`}
                width={150}
                height={100}
                className="rounded-lg object-cover w-full h-24"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeGalleryImage(index)}
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center h-24 flex items-center justify-center">
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
      case 0:
        return renderBasicInfo()
      case 1:
        return renderSpecifications()
      case 2:
        return renderFeatures()
      case 3:
        return renderPricing()
      case 4:
        return renderImages()
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/fleet')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Add New Vehicle</h1>
            <p className="text-neutral-600">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index === currentStep
            const isCompleted = completedSteps.has(index)
            const isAccessible = index <= currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(index)}
                  disabled={!isAccessible}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : isAccessible
                      ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      : 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                  <span className="text-xs font-medium">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    completedSteps.has(index) ? 'bg-green-300' : 'bg-neutral-200'
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
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-neutral-600">{steps[currentStep].description}</p>
        </div>
        
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Vehicle'}</span>
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}