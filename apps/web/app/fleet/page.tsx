'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Filter, 
  Car, 
  DollarSign, 
  Users, 
  Fuel, 
  Settings2,
  ChevronDown,
  Grid,
  List,
  Search
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, Input } from '@valore/ui'
import { formatCurrency } from '@valore/ui'

interface Vehicle {
  id: string
  slug: string
  displayName: string
  make: string
  model: string
  year: number
  category: string
  bodyType: string
  pricePerDay: number
  primaryImage: string
  specs: {
    transmission: string
    seats: number
    doors: number
  }
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'SUPERCAR', label: 'Supercar' },
  { value: 'SUV', label: 'SUV' },
  { value: 'CONVERTIBLE', label: 'Convertible' },
  { value: 'ELECTRIC', label: 'Electric' }
]

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-500', label: 'Under $500/day' },
  { value: '500-1000', label: '$500 - $1000/day' },
  { value: '1000-2000', label: '$1000 - $2000/day' },
  { value: '2000+', label: 'Above $2000/day' }
]

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    filterAndSortVehicles()
  }, [vehicles, selectedCategory, selectedPriceRange, searchTerm, sortBy])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data)
      setFilteredVehicles(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
      setLoading(false)
    }
  }

  const filterAndSortVehicles = () => {
    let filtered = [...vehicles]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.category === selectedCategory)
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p))
      filtered = filtered.filter(v => {
        if (max === Infinity) return v.pricePerDay >= min
        return v.pricePerDay >= min && v.pricePerDay <= max
      })
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricePerDay - b.pricePerDay)
        break
      case 'price-high':
        filtered.sort((a, b) => b.pricePerDay - a.pricePerDay)
        break
      case 'name':
        filtered.sort((a, b) => a.displayName.localeCompare(b.displayName))
        break
      default:
        // Keep original order (featured first)
        break
    }

    setFilteredVehicles(filtered)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Our Luxury Fleet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-neutral-200 max-w-2xl mx-auto"
          >
            Discover our curated collection of the world's most prestigious vehicles
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-40 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-1 border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-neutral-100' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-neutral-100' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-neutral-600">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </div>
        </div>
      </section>

      {/* Vehicles Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-neutral-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-neutral-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No vehicles found</h3>
              <p className="text-neutral-600">Try adjusting your filters or search criteria</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -10 }}
                >
                  <Link href={`/cars/${vehicle.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer h-full">
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
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">
                          {vehicle.displayName}
                        </h3>
                        <p className="text-neutral-600 mb-4">{vehicle.year} • {vehicle.bodyType}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                            <Settings2 className="h-4 w-4 text-neutral-400 mx-auto mb-1" />
                            <p className="text-xs text-neutral-500">Transmission</p>
                            <p className="text-sm font-medium capitalize">
                              {vehicle.specs.transmission.toLowerCase()}
                            </p>
                          </div>
                          <div className="text-center">
                            <Users className="h-4 w-4 text-neutral-400 mx-auto mb-1" />
                            <p className="text-xs text-neutral-500">Seats</p>
                            <p className="text-sm font-medium">{vehicle.specs.seats}</p>
                          </div>
                          <div className="text-center">
                            <Car className="h-4 w-4 text-neutral-400 mx-auto mb-1" />
                            <p className="text-xs text-neutral-500">Doors</p>
                            <p className="text-sm font-medium">{vehicle.specs.doors}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-sm text-neutral-600">From</p>
                            <p className="text-2xl font-bold text-primary">
                              ${vehicle.pricePerDay}
                              <span className="text-sm text-neutral-600 font-normal">/day</span>
                            </p>
                          </div>
                          <Button size="sm">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/cars/${vehicle.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative h-48 md:h-auto md:w-80 bg-gradient-to-br from-neutral-100 to-neutral-50">
                          <Image
                            src={vehicle.primaryImage}
                            alt={vehicle.displayName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            {vehicle.category}
                          </div>
                        </div>
                        
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                                {vehicle.displayName}
                              </h3>
                              <p className="text-neutral-600 mb-4">{vehicle.year} • {vehicle.bodyType}</p>
                              
                              <div className="flex gap-6 mb-4">
                                <div className="flex items-center gap-2">
                                  <Settings2 className="h-4 w-4 text-neutral-400" />
                                  <span className="text-sm capitalize">
                                    {vehicle.specs.transmission.toLowerCase()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-neutral-400" />
                                  <span className="text-sm">{vehicle.specs.seats} seats</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4 text-neutral-400" />
                                  <span className="text-sm">{vehicle.specs.doors} doors</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-neutral-600">From</p>
                              <p className="text-3xl font-bold text-primary mb-4">
                                ${vehicle.pricePerDay}
                                <span className="text-sm text-neutral-600 font-normal">/day</span>
                              </p>
                              <Button>Book Now</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}