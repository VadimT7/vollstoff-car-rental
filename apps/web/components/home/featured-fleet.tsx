'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Car } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Card } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import { staggerContainer, staggerItem } from '@valore/ui'

interface Vehicle {
  id: string
  slug: string
  displayName: string
  make: string
  model: string
  year: number
  category: string
  pricePerDay: number
  primaryImage: string
  featured: boolean
  featuredOrder: number
  specs: {
    transmission: string
    seats: number
    doors: number
  }
}

export function FeaturedFleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedVehicles()
  }, [])

  const fetchFeaturedVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles?featured=true')
      const data = await response.json()
      setVehicles(data.slice(0, 6)) // Limit to 6 featured vehicles
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch featured vehicles:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-24">
        <div className="text-center mb-16">
          <p className="text-luxury text-primary mb-4">Curated Selection</p>
          <h2 className="heading-large mb-4">Featured Fleet</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Experience the pinnacle of automotive excellence with our handpicked collection of luxury vehicles
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-neutral-200 h-64 rounded-lg mb-4"></div>
              <div className="bg-neutral-200 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-neutral-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="py-24">
        <div className="text-center">
          <Car className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="heading-large mb-4">Fleet Coming Soon</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            We're currently updating our featured fleet. Check back soon for our luxury vehicle collection.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-luxury text-primary mb-4">Curated Selection</p>
        <h2 className="heading-large mb-4">Featured Fleet</h2>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Experience the pinnacle of automotive excellence with our handpicked collection of luxury vehicles
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id}>
            <Link href={`/cars/${vehicle.slug}`}>
              <Card className="overflow-hidden group cursor-pointer h-full bg-white text-black">
                <div className="relative h-64 bg-gradient-to-br from-neutral-100 to-neutral-50">
                  <Image
                    src={vehicle.primaryImage}
                    alt={vehicle.displayName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {vehicle.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-black mb-1">
                    {vehicle.displayName}
                  </h3>
                  <p className="text-gray-600 mb-4">{vehicle.year} Model</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Transmission</p>
                      <p className="text-sm font-medium capitalize text-black">
                        {vehicle.specs.transmission.toLowerCase()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Seats</p>
                      <p className="text-sm font-medium text-black">{vehicle.specs.seats}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Doors</p>
                      <p className="text-sm font-medium text-black">{vehicle.specs.doors}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-2xl font-bold text-amber-600">
                        ${vehicle.pricePerDay}
                        <span className="text-sm text-gray-600 font-normal">/day</span>
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                      className="group-hover:bg-primary-dark transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link href="/fleet">
          <Button 
            size="lg" 
            variant="outline" 
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            View Entire Fleet
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}