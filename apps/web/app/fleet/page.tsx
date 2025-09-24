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

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
      {/* Hero Section - $10k Luxury Experience */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Background with Depth */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
          
          {/* Animated golden particles */}
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.02) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.02) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.03) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.02) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Luxury light rays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-amber-400/20 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-amber-400/20 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          
          {/* Animated Crown/Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 1.5, 
              delay: 0.3,
              type: "spring",
              stiffness: 100
            }}
            className="mb-16 relative"
          >
            <div className="inline-block relative">
              {/* Glowing backdrop */}
              <div className="absolute inset-0 bg-amber-400/10 blur-xl rounded-full scale-150" />
              
              {/* Badge content */}
              <div className="relative flex items-center justify-center gap-6 px-8 py-3 border border-amber-400/30 rounded-full backdrop-blur-sm">
                <motion.div 
                  className="w-2 h-2 bg-amber-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-amber-300 text-sm font-light tracking-[0.4em] uppercase">
                  Curated Excellence
                </span>
                <motion.div 
                  className="w-2 h-2 bg-amber-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Spectacular Main Title */}
          <div className="mb-20 relative">
            {/* "Our Luxury" - Ethereal and Light */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.8, 
                delay: 0.6,
                type: "spring",
                stiffness: 60
              }}
              className="relative mb-4"
            >
               <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light tracking-wider leading-[0.85]" style={{ fontFamily: 'Playfair Display, serif' }}>
                 <span 
                   className="bg-gradient-to-r from-white/90 via-white to-amber-100/80 bg-clip-text text-transparent"
                   style={{
                     textShadow: '0 0 40px rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   Our Luxury
                 </span>
               </h1>
               
               {/* Subtle glow effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-amber-100/5 bg-clip-text text-transparent blur-sm text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light tracking-wider leading-[0.85] -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                 Our Luxury
               </div>
            </motion.div>

            {/* "Fleet" - Bold and Golden */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ 
                duration: 2, 
                delay: 0.9,
                type: "spring",
                stiffness: 50
              }}
              className="relative"
            >
               <h1 className="text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-normal tracking-wider leading-[0.75]" style={{ fontFamily: 'Playfair Display, serif' }}>
                 <motion.span 
                   className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent"
                   animate={{
                     backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                   }}
                   transition={{
                     duration: 6,
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                   style={{
                     backgroundSize: '200% 200%',
                     textShadow: '0 0 80px rgba(251, 191, 36, 0.3)'
                   }}
                 >
                   Fleet
                 </motion.span>
               </h1>
               
               {/* Golden glow */}
               <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-amber-300/20 to-amber-500/20 bg-clip-text text-transparent blur-lg text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-normal tracking-wider leading-[0.75] -z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                 Fleet
               </div>
            </motion.div>
          </div>

          {/* Cinematic Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ 
              duration: 1.5, 
              delay: 1.4,
              ease: "easeOut"
            }}
            className="max-w-4xl mx-auto mb-16"
          >
             <p className="text-2xl md:text-3xl lg:text-4xl text-neutral-300 font-light leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
               Discover our{' '}
               <motion.span 
                 className="text-amber-300 font-normal"
                 style={{ 
                   fontFamily: 'Playfair Display, serif'
                 }}
                 animate={{ 
                   textShadow: [
                     '0 0 20px rgba(251, 191, 36, 0.3)',
                     '0 0 40px rgba(251, 191, 36, 0.5)',
                     '0 0 20px rgba(251, 191, 36, 0.3)'
                   ]
                 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               >
                 curated collection
               </motion.span>
               {' '}of the world's most{' '}
               <motion.span 
                 className="text-amber-300 font-normal"
                 style={{ 
                   fontFamily: 'Playfair Display, serif'
                 }}
                 animate={{ 
                   textShadow: [
                     '0 0 20px rgba(251, 191, 36, 0.3)',
                     '0 0 40px rgba(251, 191, 36, 0.5)',
                     '0 0 20px rgba(251, 191, 36, 0.3)'
                   ]
                 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
               >
                 prestigious vehicles
               </motion.span>
             </p>
          </motion.div>

          {/* Luxury Accent Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 2, 
              delay: 1.8,
              type: "spring",
              stiffness: 100
            }}
            className="flex items-center justify-center gap-8"
          >
            <motion.div 
              className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-3 h-3 border border-amber-400/60 rotate-45"
              animate={{ 
                rotate: [45, 135, 45],
                borderColor: ['rgba(251, 191, 36, 0.6)', 'rgba(251, 191, 36, 1)', 'rgba(251, 191, 36, 0.6)']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="h-px w-16 bg-gradient-to-l from-transparent via-amber-400/60 to-transparent"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Luxury Filters Section */}
      <section className="sticky top-0 z-40 bg-gradient-to-r from-black via-zinc-950 to-black backdrop-blur-xl border-b border-amber-400/20">
        <div className="container mx-auto px-6 py-4 md:py-8">
          
          {/* Premium Filter Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-4 md:mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
              <span className="text-amber-300 text-sm font-light tracking-[0.3em] uppercase">
                Refine Your Selection
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>
          </motion.div>

          <div className="flex flex-col xl:flex-row gap-4 md:gap-8 items-center">
            
            {/* Luxury Search */}
            <motion.div 
              className="flex-1 max-w-md"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative group">
                {/* Search Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-amber-500/5 to-amber-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative bg-black/60 backdrop-blur-md border border-amber-400/20 rounded-2xl overflow-hidden group-hover:border-amber-400/40 transition-all duration-300">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400/70 group-hover:text-amber-300 transition-colors duration-300" />
                  <input
                  type="text"
                    placeholder="Search luxury vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 md:py-4 bg-transparent text-white placeholder-neutral-400 focus:outline-none focus:placeholder-neutral-500 text-sm tracking-wide"
                />
              </div>
            </div>
            </motion.div>

            {/* Premium Filter Controls */}
            <motion.div 
              className="flex flex-wrap gap-2 md:gap-4 items-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              
              {/* Category Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                  className="relative bg-black/80 backdrop-blur-md border border-amber-400/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-light tracking-wide cursor-pointer hover:border-amber-400/50 focus:border-amber-400/70 focus:outline-none transition-all duration-300 min-w-[120px] md:min-w-[140px]"
              >
                {categories.map(cat => (
                    <option key={cat.value} value={cat.value} className="bg-black text-white">
                      {cat.label}
                    </option>
                ))}
              </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/70 pointer-events-none" />
              </div>

              {/* Price Range Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="relative bg-black/80 backdrop-blur-md border border-amber-400/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-light tracking-wide cursor-pointer hover:border-amber-400/50 focus:border-amber-400/70 focus:outline-none transition-all duration-300 min-w-[140px] md:min-w-[160px]"
              >
                {priceRanges.map(range => (
                    <option key={range.value} value={range.value} className="bg-black text-white">
                      {range.label}
                    </option>
                ))}
              </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/70 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                  className="relative bg-black/80 backdrop-blur-md border border-amber-400/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-light tracking-wide cursor-pointer hover:border-amber-400/50 focus:border-amber-400/70 focus:outline-none transition-all duration-300 min-w-[120px] md:min-w-[140px]"
              >
                  <option value="featured" className="bg-black text-white">Featured</option>
                  <option value="price-low" className="bg-black text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-black text-white">Price: High to Low</option>
                  <option value="name" className="bg-black text-white">Name: A to Z</option>
              </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/70 pointer-events-none" />
              </div>

              {/* Luxury View Mode Toggle */}
              <div className="flex bg-black/60 backdrop-blur-md border border-amber-400/30 rounded-xl p-1 md:p-1.5 gap-1">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 md:p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-400/25' 
                      : 'text-amber-400/70 hover:text-amber-300 hover:bg-amber-400/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid className="h-4 w-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 md:p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-400/25' 
                      : 'text-amber-400/70 hover:text-amber-300 hover:bg-amber-400/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Elegant Results Count */}
          <motion.div 
            className="mt-4 md:mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-black/40 backdrop-blur-md border border-amber-400/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300/80 text-sm font-light tracking-wider">
                Showing {filteredVehicles.length} of {vehicles.length} exceptional vehicles
              </span>
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          </div>
          </motion.div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 60, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.8,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -20,
                    rotateY: 2,
                    scale: 1.02
                  }}
                  className="group perspective-1000"
                >
                  <Link href={`/cars/${vehicle.slug}`}>
                    <div className="relative h-full bg-gradient-to-br from-black via-zinc-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-amber-500/10">
                      
                      {/* Luxury Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-600/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                      
                      {/* Golden Border Animation */}
                      <div className="absolute inset-0 rounded-3xl">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400/20 via-amber-500/30 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm" />
                      </div>
                      
                      {/* Premium Image Container */}
                      <div className="relative h-72 overflow-hidden">
                        {/* Image Backdrop */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                        
                        <Image
                          src={vehicle.primaryImage}
                          alt={vehicle.displayName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                        
                        {/* Floating Category Badge */}
                        <motion.div 
                          className="absolute top-6 left-6 z-20"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full scale-150" />
                            <div className="relative bg-black/90 backdrop-blur-md text-amber-300 px-4 py-2 rounded-full text-sm font-light tracking-wider uppercase border border-amber-400/30">
                          {vehicle.category}
                        </div>
                          </div>
                        </motion.div>
                        
                      </div>
                      
                      {/* Premium Content Section */}
                      <div className="relative p-8 bg-gradient-to-b from-black/95 to-black">
                        
                        {/* Vehicle Name & Details */}
                        <div className="mb-6">
                          <motion.h3 
                            className="text-2xl font-light text-white mb-2 tracking-wide"
                            whileHover={{ color: "#fbbf24" }}
                            transition={{ duration: 0.3 }}
                          >
                          {vehicle.displayName}
                          </motion.h3>
                          <p className="text-amber-300/80 text-sm font-light tracking-wider uppercase">
                            {vehicle.year} • {vehicle.bodyType}
                          </p>
                        </div>
                        
                        {/* Luxury Specs Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <motion.div 
                            className="text-center group/spec"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="relative mb-3">
                              <div className="absolute inset-0 bg-amber-400/10 blur-lg rounded-full scale-150 opacity-0 group-hover/spec:opacity-100 transition-all duration-500" />
                              <Settings2 className="h-5 w-5 text-amber-400/70 mx-auto relative group-hover/spec:text-amber-300 transition-colors duration-300" />
                            </div>
                            <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">Transmission</p>
                            <p className="text-sm font-light text-white capitalize">
                              {vehicle.specs.transmission.toLowerCase()}
                            </p>
                          </motion.div>
                          
                          <motion.div 
                            className="text-center group/spec"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="relative mb-3">
                              <div className="absolute inset-0 bg-amber-400/10 blur-lg rounded-full scale-150 opacity-0 group-hover/spec:opacity-100 transition-all duration-500" />
                              <Users className="h-5 w-5 text-amber-400/70 mx-auto relative group-hover/spec:text-amber-300 transition-colors duration-300" />
                          </div>
                            <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">Seats</p>
                            <p className="text-sm font-light text-white">{vehicle.specs.seats}</p>
                          </motion.div>
                          
                          <motion.div 
                            className="text-center group/spec"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="relative mb-3">
                              <div className="absolute inset-0 bg-amber-400/10 blur-lg rounded-full scale-150 opacity-0 group-hover/spec:opacity-100 transition-all duration-500" />
                              <Car className="h-5 w-5 text-amber-400/70 mx-auto relative group-hover/spec:text-amber-300 transition-colors duration-300" />
                          </div>
                            <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">Doors</p>
                            <p className="text-sm font-light text-white">{vehicle.specs.doors}</p>
                          </motion.div>
                        </div>
                        
                        {/* Premium Price & CTA Section */}
                        <div className="flex items-end justify-between pt-6 border-t border-amber-400/20">
                          <div>
                            <p className="text-xs text-amber-300/60 mb-1 uppercase tracking-wider">From</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-thin text-white tracking-tight">
                              ${vehicle.pricePerDay}
                              </span>
                              <span className="text-sm text-neutral-400 font-light">/day</span>
                            </div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="relative group/btn">
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl blur opacity-50 group-hover/btn:opacity-100 transition-all duration-300" />
                              <button className="relative bg-gradient-to-r from-amber-400 to-amber-500 text-black px-6 py-3 rounded-xl font-medium text-sm tracking-wide hover:from-amber-300 hover:to-amber-400 transition-all duration-300">
                                Reserve Now
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
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