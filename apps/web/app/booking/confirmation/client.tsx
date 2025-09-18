'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Calendar, MapPin, Car, FileText, Mail, Download } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@valore/ui'
import jsPDF from 'jspdf'

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
  const driverPhone = searchParams.get('driverPhone') || '+1 (438) 680-3936'
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
        return '1555 Rue Richelieu, Montreal, QC H3J 1G8'
      case 'airport':
        return '975 Roméo-Vachon Blvd N, Dorval, QC H4Y 1H1'
      case 'hotel':
        return 'Your Hotel Address (Montreal Area)'
      default:
        return '1555 Rue Richelieu, Montreal, QC H3J 1G8'
    }
  }

  // Generate email content for booking confirmation
  const generateEmailContent = () => {
    const subject = `FlyRentals Booking Confirmation - ${carName} ${carYear}`
    const body = `Dear ${driverName},

Your luxury vehicle rental has been successfully booked with FlyRentals.

BOOKING DETAILS:
Booking ID: ${bookingId}
Vehicle: ${carName} ${carYear} • ${carCategory}
Rental Period: ${formatDate(startDate)} - ${formatDate(endDate)}
Duration: ${days} day${days !== '1' ? 's' : ''}
Pickup Time: ${formatTime(startTime)}
Return Time: ${formatTime(endTime)}

PICKUP & RETURN LOCATION:
${getLocationDisplay(pickupLocation)}
${getLocationAddress(pickupLocation)}

DRIVER INFORMATION:
Name: ${driverName}
Email: ${driverEmail}
Phone: ${driverPhone}

TOTAL AMOUNT: $${parseFloat(totalPrice).toLocaleString()}

WHAT'S NEXT?
Please present yourself at the selected car pick-up location at the booked time with your driver's license.

Need help? Contact our concierge team:
Phone: +1 (234) 567-890
Email: flyrentalsca@gmail.com

Thank you for choosing FlyRentals!

Best regards,
The FlyRentals Team`

    return { subject, body }
  }

  // Handle email confirmation button click
  const handleEmailConfirmation = () => {
    const { subject, body } = generateEmailContent()
    const mailtoLink = `mailto:${driverEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_blank')
  }

  // Generate PDF confirmation
  const handleDownloadPDF = () => {
    const pdf = new jsPDF()
    
    // Add FlyRentals header
    pdf.setFontSize(24)
    pdf.setTextColor(245, 158, 11) // Amber color
    pdf.text('FlyRentals', 105, 20, { align: 'center' })
    
    pdf.setFontSize(16)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Booking Confirmation', 105, 30, { align: 'center' })
    
    // Add booking ID
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Booking ID: ${bookingId}`, 105, 40, { align: 'center' })
    
    // Add a line separator
    pdf.setDrawColor(200, 200, 200)
    pdf.line(20, 45, 190, 45)
    
    // Vehicle Information
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Vehicle Information', 20, 55)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Vehicle: ${carName}`, 20, 65)
    pdf.text(`Year: ${carYear}`, 20, 72)
    pdf.text(`Category: ${carCategory}`, 20, 79)
    
    // Rental Period
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Rental Period', 20, 95)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Pick-up: ${new Date(startDate).toLocaleDateString()} at ${startTime}`, 20, 105)
    pdf.text(`Return: ${new Date(endDate).toLocaleDateString()} at ${endTime}`, 20, 112)
    pdf.text(`Duration: ${days} day${parseInt(days) > 1 ? 's' : ''}`, 20, 119)
    
    // Location
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Pickup & Return Location', 20, 135)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    const locationText = pickupLocation === 'showroom' 
      ? 'FlyRentals Showroom (Montreal)\n123 Luxury Street, Montreal, QC H3A 1A1'
      : pickupLocation === 'airport'
      ? 'Montreal Airport (YUL)\n975 Roméo-Vachon Blvd N, Dorval, QC H4Y 1H1'
      : 'Hotel Delivery (Montreal Area)'
    
    const locationLines = locationText.split('\n')
    locationLines.forEach((line, index) => {
      pdf.text(line, 20, 145 + (index * 7))
    })
    
    // Driver Information
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Driver Information', 20, 165)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Name: ${driverName}`, 20, 175)
    pdf.text(`Email: ${driverEmail}`, 20, 182)
    pdf.text(`Phone: ${driverPhone}`, 20, 189)
    
    // Payment Information
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Payment Information', 20, 205)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Total Amount: $${parseFloat(totalPrice).toLocaleString()} CAD`, 20, 215)
    pdf.text('Payment Status: Completed', 20, 222)
    
    // Important Information
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Important Information', 20, 238)
    
    pdf.setFontSize(10)
    pdf.setTextColor(60, 60, 60)
    const importantInfo = [
      '• Please bring a valid driver\'s license and credit card',
      '• Minimum age requirement: 25 years',
      '• Full insurance coverage included',
      '• 24/7 roadside assistance available'
    ]
    
    importantInfo.forEach((info, index) => {
      pdf.text(info, 20, 248 + (index * 6))
    })
    
    // Footer
    pdf.setFontSize(10)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Thank you for choosing FlyRentals!', 105, 280, { align: 'center' })
    pdf.text('Contact: +1 (438) 680-3936 | flyrentalsca@gmail.com', 105, 287, { align: 'center' })
    
    // Save the PDF
    pdf.save(`FlyRentals_Booking_${bookingId}.pdf`)
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
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-primary text-white hover:bg-primary/90" 
                size="lg"
                onClick={handleDownloadPDF}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Confirmation
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300" 
                size="lg"
                onClick={handleEmailConfirmation}
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Email Confirmation
              </Button>
            </div>
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
              <Link href="tel:+14386803936">
                <Button variant="outline" size="lg" className="text-base">
                  +1 (438) 680-3936
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
