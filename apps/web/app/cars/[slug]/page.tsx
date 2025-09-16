'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Fuel, 
  Gauge, 
  Zap,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  Shield,
  Award,
  Car,
  Settings,
  TrendingUp
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button, Card, Input } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import { staggerContainer, staggerItem } from '@valore/ui'
import { AutoOpenInput } from '@/components/ui/auto-open-input'
import { DateInputWithAvailability } from '@/components/ui/date-input-with-availability'

// Default services and requirements for all cars
const defaultServices = [
  'Full Insurance Coverage',
  '24/7 Roadside Assistance',
  'Professional Delivery',
  'Vehicle Inspection',
  'Cleaning Service',
  'Fuel Top-up',
]

const defaultRequirements = [
  'Valid Driver\'s License',
  'Minimum Age: 25',
  'Clean Driving Record',
  'Credit Card for Deposit',
  'International License (if applicable)',
]

// Default features for all cars
const defaultFeatures = [
  'Climate Control',
  'Infotainment System',
  'Bluetooth Connectivity',
  'Parking Sensors',
  'Backup Camera',
  'Premium Audio System',
  'Navigation System',
  'Apple CarPlay',
  'Android Auto',
]

export default function CarDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '', startTime: '10:00', endTime: '10:00' })
  const [isFavorite, setIsFavorite] = useState(false)
  const [showDateWarning, setShowDateWarning] = useState(false)
  const [blockedDates, setBlockedDates] = useState<Record<string, { booked: boolean, reason?: string }>>({})
  const [availabilityLoading, setAvailabilityLoading] = useState(false)

  // Validate if dates are selected
  const areDatesSelected = selectedDates.start && selectedDates.end

  // Handle Book Now click
  const handleBookNow = (e: React.MouseEvent) => {
    if (!areDatesSelected) {
      e.preventDefault()
      setShowDateWarning(true)
      // Hide warning after 3 seconds
      setTimeout(() => setShowDateWarning(false), 3000)
      return
    }
    // If dates are selected, let the Link handle navigation
  }

  // Fetch car availability
  const fetchAvailability = async (carId: string) => {
    try {
      setAvailabilityLoading(true)
      const response = await fetch(`/api/availability?carId=${carId}`)
      if (response.ok) {
        const data = await response.json()
        setBlockedDates(data.blockedDates || {})
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setAvailabilityLoading(false)
    }
  }

  useEffect(() => {
    const fetchCar = async () => {
      try {
        console.log('🔍 Fetching car with slug:', slug)
        const response = await fetch(`/api/vehicles?slug=${slug}`)
        if (response.ok) {
          const carData = await response.json()
          console.log('✅ Car data loaded:', carData)
          setCar(carData)
          // Fetch availability after getting car data
          if (carData.id) {
            fetchAvailability(carData.id)
          }
        } else {
          console.error('❌ Failed to fetch car:', response.status)
          setCar(null)
        }
      } catch (error) {
        console.error('❌ Error fetching car:', error)
        setCar(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCar()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-large text-slate-900 mb-4">Car Not Found</h1>
          <p className="text-slate-600 mb-6">The vehicle you're looking for doesn't exist.</p>
          <Link href="/fleet">
            <Button>Back to Fleet</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Transform fleet data to match the expected format
  const carData = {
    id: car.id,
    slug: car.slug,
    make: car.make,
    model: car.model,
    displayName: car.displayName,
    year: car.year,
    category: car.category,
    pricePerDay: car.pricePerDay,
    images: [car.primaryImage, ...(car.images || [])],
    specs: {
      power: car.specs?.horsePower ? `${car.specs.horsePower} HP` : 'N/A',
      acceleration: car.specs?.acceleration ? `${car.specs.acceleration}s` : 'N/A',
      topSpeed: car.specs?.topSpeed ? `${car.specs.topSpeed} km/h` : 'N/A',
      engine: car.specs?.engineType || 'N/A',
      transmission: car.specs?.transmission || 'Automatic',
      drivetrain: car.specs?.drivetrain || 'RWD',
      fuelType: car.specs?.fuelType || 'Petrol',
      seats: car.specs?.seats || 5,
      doors: car.specs?.doors || 4,
      fuelConsumption: car.specs?.fuelConsumption ? `${car.specs.fuelConsumption} L/100km` : 'N/A',
      weight: 'N/A',
    },
    rating: 4.9,
    reviewCount: 127,
    featured: car.featured,
    location: 'Montreal',
    available: true,
    // Use actual description from database, fallback to default if not available
    description: car.description || `Experience the ${car.make} ${car.model}, a premium vehicle that combines luxury, performance, and cutting-edge technology. This ${car.year} model offers an exceptional driving experience with its powerful engine and sophisticated features.`,
    // Use actual features from database if available, otherwise use defaults
    features: car.features && car.features.length > 0 ? car.features : defaultFeatures,
    includedServices: car.includedServices && car.includedServices.length > 0 ? car.includedServices : defaultServices,
    requirements: car.requirements && car.requirements.length > 0 ? car.requirements : defaultRequirements,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/fleet" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Fleet
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="heading-large text-slate-900 mb-2">{carData.displayName}</h1>
                  <p className="text-slate-600 text-lg">{carData.year} • {carData.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{carData.rating}</span>
                  <span className="text-slate-500">({carData.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span>{carData.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={carData.images[selectedImage]}
                  alt={carData.displayName}
                  fill
                  className={`object-cover ${
                    carData.slug === 'mercedes-c43-amg' ? 'object-[center_73%]' : 
                    carData.slug === 'mercedes-cla-250-2018' ? 'object-[center_37%]' : 'object-center'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {carData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${carData.displayName} - Image ${index + 1}`}
                      fill
                      className={`object-cover ${
                        carData.slug === 'mercedes-c43-amg' ? 'object-[center_73%]' : 
                        carData.slug === 'mercedes-cla-250-2018' ? 'object-[center_37%]' : 'object-center'
                      }`}
                      sizes="(max-width: 768px) 25vw, 20vw"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed">{carData.description}</p>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Power</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{carData.specs.power}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Acceleration</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{carData.specs.acceleration}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <Gauge className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Top Speed</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{carData.specs.topSpeed}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Engine</h3>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{carData.specs.engine}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <Car className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Transmission</h3>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{carData.specs.transmission}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Seats</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{carData.specs.seats}</p>
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carData.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-8"
            >
              <Card className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {formatCurrency(carData.pricePerDay)} CAD
                  </p>
                  <p className="text-slate-600">per day</p>
                </div>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Select Dates</h3>
                  {availabilityLoading && (
                    <div className="text-sm text-gray-500 mb-2">Loading availability...</div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pick-up Date
                      </label>
                      <DateInputWithAvailability
                        value={selectedDates.start}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, start: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        blockedDates={blockedDates}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pick-up Time
                      </label>
                      <AutoOpenInput
                        type="time"
                        value={selectedDates.startTime}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Return Date
                      </label>
                      <DateInputWithAvailability
                        value={selectedDates.end}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, end: e.target.value }))}
                        min={selectedDates.start || new Date().toISOString().split('T')[0]}
                        blockedDates={blockedDates}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Return Time
                      </label>
                      <AutoOpenInput
                        type="time"
                        value={selectedDates.endTime}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Date Selection Warning */}
                {showDateWarning && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">
                      Please select both pick-up and return dates before booking.
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-3 mb-6">
                  <Link 
                    href={areDatesSelected ? `/booking/${carData.slug}?start=${selectedDates.start}&end=${selectedDates.end}&startTime=${selectedDates.startTime}&endTime=${selectedDates.endTime}&step=2` : '#'}
                    onClick={handleBookNow}
                  >
                    <Button 
                      className={`w-full font-bold text-lg py-4 shadow-lg transition-all duration-300 border-0 relative overflow-hidden group ${
                        areDatesSelected 
                          ? 'bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary hover:via-primary/95 hover:to-primary text-white hover:shadow-2xl hover:shadow-primary/50 transform hover:scale-105' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      size="lg"
                      disabled={!areDatesSelected}
                    >
                      {/* Glowing background effect - only when enabled */}
                      {areDatesSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 h-full"></div>
                      )}
                      
                      {/* Inner glow effect - only when enabled */}
                      {areDatesSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 blur-sm group-hover:blur-md transition-all duration-300"></div>
                      )}
                      
                      {/* Text with glow */}
                      <span className={`relative z-10 transition-all duration-300 ${
                        areDatesSelected 
                          ? 'drop-shadow-lg group-hover:drop-shadow-2xl group-hover:drop-shadow-primary/50' 
                          : ''
                      }`}>
                        Book Now
                      </span>
                    </Button>
                  </Link>
                </div>

                {/* Included Services */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Included Services</h3>
                  <div className="space-y-2">
                    {carData.includedServices.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Requirements</h3>
                  <div className="space-y-2">
                    {carData.requirements.map((requirement: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        {requirement}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
