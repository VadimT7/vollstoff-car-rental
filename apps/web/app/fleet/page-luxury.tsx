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
      <section className="relative h-[60vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Luxury Background with Animated Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-neutral-900 to-black">
          {/* Animated luxury pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.1)_0%,transparent_50%)] animate-pulse"></div>
            <div 
              className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.05)_0%,transparent_50%)] animate-pulse" 
              style={{animationDelay: '1s'}}
            ></div>
            <div 
              className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(245,158,11,0.08)_0%,transparent_50%)] animate-pulse" 
              style={{animationDelay: '2s'}}
            ></div>
          </div>
          
          {/* Luxury texture overlay */}
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Floating luxury elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-16 h-16 border border-amber-500/20 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-32 right-16 w-12 h-12 border border-amber-500/15 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-32 left-20 w-8 h-8 border border-amber-500/25 rounded-full"
          />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          {/* Luxury badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-8"
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-amber-200 text-sm font-medium tracking-wider uppercase">Premium Collection</span>
          </motion.div>

          {/* Main heading with luxury typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">
              Our Luxury
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
              Fleet
            </span>
          </motion.h1>

          {/* Subtitle with elegant styling */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-300 max-w-4xl mx-auto mb-8 leading-relaxed font-light"
          >
            Discover our <span className="text-amber-300 font-medium">curated collection</span> of the world's most 
            <span className="text-amber-300 font-medium"> prestigious vehicles</span>
          </motion.p>

          {/* Luxury stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mb-8"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">50+</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider">Exotic Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">24/7</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider">Concierge Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">5★</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider">Premium Experience</div>
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-amber-500/25 border border-amber-400/20"
            >
              Explore Collection
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              View Pricing
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
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