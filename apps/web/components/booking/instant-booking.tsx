'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { Button, Card, Input, Label } from '@valore/ui'
import { useRouter } from 'next/navigation'
import { cn } from '@valore/ui'

export function InstantBooking() {
  const router = useRouter()
  const [pickupDate, setPickupDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'))
  const [returnDate, setReturnDate] = useState(format(addDays(new Date(), 10), 'yyyy-MM-dd'))
  const [pickupTime, setPickupTime] = useState('10:00')
  const [returnTime, setReturnTime] = useState('10:00')
  const [location, setLocation] = useState('showroom')

  const handleSearch = () => {
    const params = new URLSearchParams({
      pickup: pickupDate,
      return: returnDate,
      pickupTime,
      returnTime,
      location,
    })
    router.push(`/fleet?${params.toString()}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-luxury-lg p-8 lg:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-light mb-2">Book Your Experience</h2>
          <p className="text-neutral-600">Select your dates and find your perfect luxury vehicle</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Pickup Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Pickup Date
            </Label>
            <Input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="bg-white"
            />
          </div>

          {/* Pickup Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Pickup Time
            </Label>
            <Input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Return Date
            </Label>
            <Input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate}
              className="bg-white"
            />
          </div>

          {/* Return Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Return Time
            </Label>
            <Input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              size="lg"
              className="w-full"
              shimmer
            >
              Search Fleet
            </Button>
          </div>
        </div>

        {/* Location Toggle */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <Label className="flex items-center gap-2 text-sm mb-3">
            <MapPin className="h-4 w-4" />
            Pickup Location
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLocation('showroom')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                location === 'showroom'
                  ? 'border-primary bg-primary/5'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              <p className="font-medium mb-1">Elite Motion Rentals Showroom</p>
              <p className="text-sm text-neutral-600">1555 Rue Richelieu, Montreal, QC H3J 1G8</p>
            </button>
            <button
              onClick={() => setLocation('delivery')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                location === 'delivery'
                  ? 'border-primary bg-primary/5'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              <p className="font-medium mb-1">Delivery Service</p>
              <p className="text-sm text-neutral-600">We bring the car to you</p>
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
