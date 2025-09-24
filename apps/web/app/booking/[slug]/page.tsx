'use client'

import { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Car,
  Settings,
  FileText,
  CreditCard as PaymentIcon
} from 'lucide-react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, Input, Label } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import { AutoOpenInput } from '@/components/ui/auto-open-input'
import { CalendarWithAvailability } from '@/components/ui/calendar-with-availability'
import { ClickableTimeInput } from '@/components/ui/clickable-time-input'
// Removed static data import - now using API
import dynamicImport from 'next/dynamic'

// Dynamically import PaymentForm to avoid SSR issues with Stripe
const PaymentForm = dynamicImport(() => import('@/components/booking/payment-form'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
    </div>
  ),
})

const steps = [
  { id: 1, title: 'Dates & Times', icon: Calendar },
  { id: 2, title: 'Pickup & Return', icon: MapPin },
  { id: 3, title: 'Driver Details', icon: User },
  { id: 4, title: 'Add-ons', icon: Settings },
  { id: 5, title: 'Review & Pay', icon: PaymentIcon },
]

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // All hooks must be called at the top level
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(() => {
    const step = parseInt(searchParams.get('step') || '1')
    return step >= 1 && step <= 5 ? step : 1
  })
  const [bookingData, setBookingData] = useState({
    startDate: searchParams.get('start') || '',
    endDate: searchParams.get('end') || '',
    startTime: searchParams.get('startTime') || '10:00',
    endTime: searchParams.get('endTime') || '10:00',
    pickupLocation: 'showroom',
    returnLocation: 'showroom',
    driverName: '',
    driverEmail: '',
    driverPhone: '',
    driverLicense: '',
    addOns: {
      insurance: 'basic',
      extraMileage: false,
      childSeat: false,
      chauffeur: false,
    },
    paymentMethod: 'card',
  })

  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch car data from API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        console.log('🔍 Fetching car for booking with slug:', slug)
        const response = await fetch(`/api/vehicles?slug=${slug}`)
        if (response.ok) {
          const carData = await response.json()
          console.log('✅ Car data loaded for booking:', carData)
          setCar(carData)
        } else {
          console.error('❌ Failed to fetch car for booking:', response.status)
          setCar(null)
        }
      } catch (error) {
        console.error('❌ Error fetching car for booking:', error)
        setCar(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCar()
    }
  }, [slug])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  // Error state - car not found
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

  // Transform API data to match expected format
  const carData = {
    id: car.id,
    slug: car.slug,
    make: car.make,
    model: car.model,
    displayName: car.displayName,
    year: car.year,
    category: car.category,
    pricePerDay: car.pricePerDay,
    image: car.primaryImage,
    specs: {
      power: car.specs.horsePower ? `${car.specs.horsePower} HP` : 'N/A',
      acceleration: car.specs.acceleration ? `${car.specs.acceleration}s` : 'N/A',
      topSpeed: car.specs.topSpeed ? `${car.specs.topSpeed} km/h` : 'N/A',
    },
    rating: 4.9,
    featured: car.featured,
    location: 'Montreal',
    available: true,
  }

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }

  const calculateTotal = () => {
    const days = calculateDays()
    const basePrice = carData.pricePerDay * days
    let addOnsPrice = 0
    
    if (bookingData.addOns.extraMileage) addOnsPrice += 50 * days
    if (bookingData.addOns.childSeat) addOnsPrice += 25 * days
    if (bookingData.addOns.chauffeur) addOnsPrice += 200 * days
    
    return basePrice + addOnsPrice
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Dates & Times
        if (!bookingData.startDate || !bookingData.endDate || !bookingData.startTime || !bookingData.endTime) {
          return { isValid: false, message: 'Please fill in all date and time fields' }
        }
        if (new Date(bookingData.startDate) >= new Date(bookingData.endDate)) {
          return { isValid: false, message: 'Return date must be after pick-up date' }
        }
        return { isValid: true }
      
      case 2: // Pickup & Return
        if (!bookingData.pickupLocation || !bookingData.returnLocation) {
          return { isValid: false, message: 'Please select pickup and return locations' }
        }
        return { isValid: true }
      
      case 3: // Driver Details
        if (!bookingData.driverName || !bookingData.driverEmail || !bookingData.driverPhone || !bookingData.driverLicense) {
          return { isValid: false, message: 'Please fill in all driver information fields' }
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(bookingData.driverEmail)) {
          return { isValid: false, message: 'Please enter a valid email address' }
        }
        return { isValid: true }
      
      case 4: // Add-ons (optional)
        return { isValid: true }
      
      case 5: // Review & Pay
        return { isValid: true }
      
      default:
        return { isValid: true }
    }
  }

  const handleNext = () => {
    const validation = validateCurrentStep()
    
    if (!validation.isValid) {
      // Show error message (you can replace this with a toast notification)
      alert(validation.message)
      return
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      console.log('💳 Payment successful, creating booking...')
      
      // Create booking in database
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: carData.id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          pickupType: bookingData.pickupLocation === 'showroom' ? 'SHOWROOM' : 'DELIVERY',
          returnType: bookingData.returnLocation === 'showroom' ? 'SHOWROOM' : 'DELIVERY',
          pickupLocation: bookingData.pickupLocation === 'showroom' ? 'VollStoff Rentals Showroom' : 'Delivery',
          returnLocation: bookingData.returnLocation === 'showroom' ? 'VollStoff Rentals Showroom' : 'Delivery',
          guestEmail: bookingData.driverEmail,
          guestName: bookingData.driverName,
          guestPhone: bookingData.driverPhone,
          customerNotes: `Driver License: ${bookingData.driverLicense}`,
          paymentIntentId,
          totalAmount: calculateTotal(),
          basePriceTotal: calculateTotal(),
          includedKm: 200,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const result = await response.json()
      console.log('✅ Booking created:', result.booking)

      // Redirect to confirmation page with booking data
      const params = new URLSearchParams({
        bookingId: result.booking.bookingNumber,
        paymentIntentId,
        carSlug: carData.slug,
        carName: carData.displayName,
        carYear: carData.year.toString(),
        carCategory: carData.category,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        pickupLocation: bookingData.pickupLocation,
        returnLocation: bookingData.returnLocation,
        driverName: bookingData.driverName,
        driverEmail: bookingData.driverEmail,
        driverPhone: bookingData.driverPhone,
        totalPrice: calculateTotal().toString(),
        days: calculateDays().toString()
      })
      
      router.push(`/booking/confirmation?${params.toString()}`)
    } catch (error) {
      console.error('❌ Failed to create booking:', error)
      // Still redirect to confirmation page but show error
      const bookingId = `FLY-${Date.now()}`
      const params = new URLSearchParams({
        bookingId,
        paymentIntentId,
        carSlug: carData.slug,
        carName: carData.displayName,
        carYear: carData.year.toString(),
        carCategory: carData.category,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        pickupLocation: bookingData.pickupLocation,
        returnLocation: bookingData.returnLocation,
        driverName: bookingData.driverName,
        driverEmail: bookingData.driverEmail,
        driverPhone: bookingData.driverPhone,
        totalPrice: calculateTotal().toString(),
        days: calculateDays().toString(),
        error: 'Booking creation failed'
      })
      router.push(`/booking/confirmation?${params.toString()}`)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error)
    // You can show an error toast or modal here
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="heading-medium text-slate-900 mb-4">Select Your Dates & Times</h2>
              <p className="text-slate-600 mb-6">Choose when you'd like to pick up and return your luxury vehicle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div className="md:col-span-4">
                <CalendarWithAvailability
                  id="startDate"
                  label="Pick-up Date"
                  required
                  value={bookingData.startDate}
                  onChange={(date) => setBookingData(prev => ({ ...prev, startDate: date }))}
                  min={new Date().toISOString().split('T')[0]}
                  carId={car?.id}
                />
              </div>
              <div className="md:col-span-3">
                <ClickableTimeInput
                  id="startTime"
                  label="Pick-up Time"
                  required
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="md:col-span-4">
                <CalendarWithAvailability
                  id="endDate"
                  label="Return Date"
                  required
                  value={bookingData.endDate}
                  onChange={(date) => setBookingData(prev => ({ ...prev, endDate: date }))}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  carId={car?.id}
                />
              </div>
              <div className="md:col-span-3">
                <ClickableTimeInput
                  id="endTime"
                  label="Return Time"
                  required
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            {calculateDays() > 0 && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">Rental Duration:</span>
                  <span className="text-primary font-bold">{calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                </div>
              </Card>
            )}
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="heading-medium text-slate-900 mb-4">Pickup & Return Location</h2>
              <p className="text-slate-600 mb-6">Choose where you'd like to pick up and return your vehicle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <select
                  id="pickupLocation"
                  value={bookingData.pickupLocation}
                  onChange={(e) => setBookingData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="showroom">VollStoff Rentals Showroom (Montreal)</option>
                  <option value="airport">Montreal Airport (YUL)</option>
                  <option value="hotel">Hotel Delivery (Montreal Area)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="returnLocation">Return Location</Label>
                <select
                  id="returnLocation"
                  value={bookingData.returnLocation}
                  onChange={(e) => setBookingData(prev => ({ ...prev, returnLocation: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="showroom">VollStoff Rentals Showroom (Montreal)</option>
                  <option value="airport">Montreal Airport (YUL)</option>
                  <option value="hotel">Hotel Pickup (Montreal Area)</option>
                </select>
              </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Location Information</h3>
                  <p className="text-blue-700 text-sm">
                    Our original pick-up location is located at 1555 Rue Richelieu, Montreal, QC H3J 1G8. Airport and hotel delivery services are available 
                    for an additional fee. Please contact us for specific arrangements.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="heading-medium text-slate-900 mb-4">Driver Information</h2>
              <p className="text-slate-600 mb-6">Please provide your details for the rental agreement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="driverName">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="driverName"
                  type="text"
                  value={bookingData.driverName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, driverName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="driverEmail">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="driverEmail"
                  type="email"
                  value={bookingData.driverEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, driverEmail: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="driverPhone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="driverPhone"
                  type="tel"
                  value={bookingData.driverPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, driverPhone: e.target.value }))}
                  placeholder="+1 (438) 680-3936"
                />
              </div>
              <div>
                <Label htmlFor="driverLicense">Driver's License Number <span className="text-red-500">*</span></Label>
                <Input
                  id="driverLicense"
                  type="text"
                  value={bookingData.driverLicense}
                  onChange={(e) => setBookingData(prev => ({ ...prev, driverLicense: e.target.value }))}
                  placeholder="A123456789"
                />
              </div>
            </div>

            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Requirements</h3>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Minimum age: 25 years old</li>
                    <li>• Valid driver's license for at least 2 years</li>
                    <li>• Clean driving record</li>
                    <li>• Credit card for security deposit</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="heading-medium text-slate-900 mb-4">Additional Services</h2>
              <p className="text-slate-600 mb-6">Enhance your rental experience with our premium add-ons.</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Extra Mileage Package</h3>
                    <p className="text-slate-600 text-sm">Additional 200km per day ($50/day)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingData.addOns.extraMileage}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      addOns: { ...prev.addOns, extraMileage: e.target.checked }
                    }))}
                    className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Child Safety Seat</h3>
                    <p className="text-slate-600 text-sm">For children 0-12 years old ($25/day)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingData.addOns.childSeat}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      addOns: { ...prev.addOns, childSeat: e.target.checked }
                    }))}
                    className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Professional Chauffeur</h3>
                    <p className="text-slate-600 text-sm">Let us drive for you ($200/day)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingData.addOns.chauffeur}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      addOns: { ...prev.addOns, chauffeur: e.target.checked }
                    }))}
                    className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                </div>
              </Card>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="heading-medium text-slate-900 mb-4">Review & Payment</h2>
              <p className="text-slate-600 mb-6">Review your booking details and complete payment.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Vehicle:</span>
                      <span className="font-medium">{carData.displayName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-medium">{calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pickup:</span>
                      <span className="font-medium">{bookingData.startDate} at {bookingData.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Return:</span>
                      <span className="font-medium">{bookingData.endDate} at {bookingData.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Driver:</span>
                      <span className="font-medium">{bookingData.driverName}</span>
                    </div>
                  </div>
                </Card>

                {/* Payment Form will be shown below */}
              </div>

              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Price Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Rate ({calculateDays()} days):</span>
                    <span className="font-medium">{formatCurrency(carData.pricePerDay * calculateDays())} CAD</span>
                  </div>
                  {bookingData.addOns.extraMileage && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Extra Mileage:</span>
                      <span className="font-medium">{formatCurrency(50 * calculateDays())} CAD</span>
                    </div>
                  )}
                  {bookingData.addOns.childSeat && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Child Seat:</span>
                      <span className="font-medium">{formatCurrency(25 * calculateDays())} CAD</span>
                    </div>
                  )}
                  {bookingData.addOns.chauffeur && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Chauffeur:</span>
                      <span className="font-medium">{formatCurrency(200 * calculateDays())} CAD</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Total:</span>
                      <span className="font-bold text-primary text-lg">{formatCurrency(calculateTotal())} CAD</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stripe Payment Form */}
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Secure Payment</h3>
                <PaymentForm
                  amount={calculateTotal()}
                  bookingData={{
                    ...bookingData,
                    carSlug: carData.slug,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Card>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/cars/${carData.slug}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to {carData.displayName}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-slate-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Car Summary */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                <img
                  src={carData.image}
                  alt={carData.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">{carData.displayName}</h2>
                <p className="text-slate-600">{carData.year} • {carData.category}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-2xl font-bold text-primary">{formatCurrency(carData.pricePerDay)} CAD</span>
                  <span className="text-slate-500">per day</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Step Content */}
          <Card className="p-8">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {currentStep < steps.length ? (
                <Button onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <div className="text-sm text-slate-500">
                  Review your details above and click "Pay" to complete your booking
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

