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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={`/cars/${vehicle.slug}`}>
              <div className="group cursor-pointer h-full transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2">
                {/* Premium Card Container */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-black shadow-2xl shadow-black/20 border border-slate-700/50 backdrop-blur-sm">
                  {/* Luxury Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Image Section */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                    {vehicle.primaryImage ? (
                      <Image
                        src={vehicle.primaryImage}
                        alt={vehicle.displayName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            const fallback = parent.querySelector('.car-placeholder')
                            if (fallback) {
                              (fallback as HTMLElement).style.display = 'flex'
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className="car-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900" 
                      style={{ display: vehicle.primaryImage ? 'none' : 'flex' }}
                    >
                      <Car className="h-20 w-20 text-slate-500" />
                    </div>
                    
                    {/* Premium Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg shadow-amber-500/30">
                        {vehicle.category}
                      </div>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-6 right-6">
                      <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-10 bg-gradient-to-br from-slate-900 to-black relative">
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent rounded-b-3xl"></div>
                    
                    <div className="relative z-10">
                      {/* Title Section */}
                      <div className="mb-6">
                         <h3 className="text-2xl font-bold mb-2 leading-tight relative overflow-hidden">
                           <span className="bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-transparent relative z-10">
                             {vehicle.displayName}
                           </span>
                           {/* Shining overlay effect */}
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-out transform -skew-x-12 z-20 pointer-events-none"></div>
                         </h3>
                        <p className="text-slate-400 font-medium">{vehicle.year} Model</p>
                      </div>
                      
                      {/* Specs Grid */}
                      <div className="grid grid-cols-3 gap-8 mb-10">
                        <div className="text-center group/spec">
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 group-hover/spec:border-amber-500/50 transition-colors duration-300">
                             <p className="text-xs text-amber-400 mb-1 uppercase tracking-wider">Transmission</p>
                            <p className="text-sm font-semibold capitalize text-white">
                              {vehicle.specs.transmission.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <div className="text-center group/spec">
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 group-hover/spec:border-amber-500/50 transition-colors duration-300">
                             <p className="text-xs text-amber-400 mb-1 uppercase tracking-wider">Seats</p>
                            <p className="text-sm font-semibold text-white">{vehicle.specs.seats}</p>
                          </div>
                        </div>
                        <div className="text-center group/spec">
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 group-hover/spec:border-amber-500/50 transition-colors duration-300">
                             <p className="text-xs text-amber-400 mb-1 uppercase tracking-wider">Doors</p>
                            <p className="text-sm font-semibold text-white">{vehicle.specs.doors}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price and CTA Section */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                        <div>
                          <p className="text-sm text-slate-400 mb-1 uppercase tracking-wide">Starting from</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                              ${vehicle.pricePerDay}
                            </span>
                            <span className="text-slate-400 font-medium">/day</span>
                          </div>
                        </div>
                        <div className="transform group-hover:scale-105 transition-transform duration-300">
                          <Button 
                            size="sm" 
                            rightIcon={<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 border-0 hover:shadow-amber-500/40 transition-all duration-300"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-amber-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                </div>
              </div>
            </Link>
          </motion.div>
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