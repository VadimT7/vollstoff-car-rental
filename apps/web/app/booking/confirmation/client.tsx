'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Calendar, MapPin, Car, FileText, Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@valore/ui'

export default function BookingConfirmationClient() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  
  // Get all booking data from URL parameters
  const carName = searchParams.get('carName') || 'Vehicle'
  const carYear = searchParams.get('carYear') || '2024'
  const carCategory = searchParams.get('carCategory') || 'Luxury'
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const startTime = searchParams.get('startTime') || '10:00'
  const endTime = searchParams.get('endTime') || '10:00'
  const pickupLocation = searchParams.get('pickupLocation') || 'showroom'
  const returnLocation = searchParams.get('returnLocation') || 'showroom'
  const driverName = searchParams.get('driverName') || 'Driver'
  const driverEmail = searchParams.get('driverEmail') || 'driver@example.com'
  const driverPhone = searchParams.get('driverPhone') || '+1 (555) 123-4567'
  const totalPrice = searchParams.get('totalPrice') || '0'
  const days = searchParams.get('days') || '1'

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not specified'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch (error) {
      return 'Date not specified'
    }
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '10:00 AM'
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Get location display name
  const getLocationDisplay = (location: string) => {
    switch (location) {
      case 'showroom':
        return 'FlyRentals Showroom (Montreal)'
      case 'airport':
        return 'Montreal Airport (YUL)'
      case 'hotel':
        return 'Hotel Delivery (Montreal Area)'
      default:
        return 'FlyRentals Showroom (Montreal)'
    }
  }

  const getLocationAddress = (location: string) => {
    switch (location) {
      case 'showroom':
        return '123 Luxury Street, Montreal, QC H3A 1A1'
      case 'airport':
        return '975 Roméo-Vachon Blvd N, Dorval, QC H4Y 1H1'
      case 'hotel':
        return 'Your Hotel Address (Montreal Area)'
      default:
        return '123 Luxury Street, Montreal, QC H3A 1A1'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="heading-large text-slate-900 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-slate-600 mb-2">
              Your luxury vehicle rental has been successfully booked.
            </p>
            <p className="text-slate-500">
              Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
            </p>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-luxury-lg p-8 mb-8"
          >
            <h2 className="heading-medium text-slate-900 mb-6">Booking Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Car className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Vehicle</h3>
                  <p className="text-slate-600">{carName}</p>
                  <p className="text-sm text-slate-500">{carYear} • {carCategory}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Rental Period</h3>
                  <p className="text-slate-600">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {days} day{days !== '1' ? 's' : ''} • Pickup: {formatTime(startTime)} • Return: {formatTime(endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Pickup & Return</h3>
                  <p className="text-slate-600">{getLocationDisplay(pickupLocation)}</p>
                  <p className="text-sm text-slate-500">{getLocationAddress(pickupLocation)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Driver</h3>
                  <p className="text-slate-600">{driverName}</p>
                  <p className="text-sm text-slate-500">{driverEmail} • {driverPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 text-primary mt-1 flex items-center justify-center">
                  <span className="text-lg font-bold">$</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Total Amount</h3>
                  <p className="text-slate-600">${parseFloat(totalPrice).toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Payment completed successfully</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 mb-8 text-white"
          >
            <h2 className="heading-medium mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">
                Congratulations! Your booking has been successfully confirmed.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">
                  Next, please present yourself at the selected car pick-up location at the booked time with your driver's license.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">
                  And then, you drive off into the sunset like a real   boss!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 px-8 py-3" 
              size="lg"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>Email Confirmation</span>
            </Button>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-600 mb-6 text-lg">
              Need help? Contact our concierge team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="tel:+1234567890">
                <Button variant="outline" size="lg" className="text-base">
                  +1 (234) 567-890
                </Button>
              </Link>
              <Link href="mailto:flyrentalsca@gmail.com">
                <Button variant="outline" size="lg" className="text-base">
                  flyrentalsca@gmail.com
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Back to Fleet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/fleet">
              <Button variant="ghost" size="lg" className="text-base">
                Browse More Vehicles
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
