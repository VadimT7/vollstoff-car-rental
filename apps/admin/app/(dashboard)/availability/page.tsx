'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Car,
  AlertCircle,
  CheckCircle,
  Eye,
  User,
  CalendarDays,
  DollarSign,
  XCircle,
  Wrench,
  Plus,
  Filter,
  Settings,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Send
} from 'lucide-react'
import { Button, Card } from '@valore/ui'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  getDay,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  addDays,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks
} from 'date-fns'

interface VehicleAvailability {
  id: string
  name: string
  plate: string
  category: string
  availability: {
    [date: string]: {
      status: 'available' | 'booked' | 'maintenance' | 'blocked'
      bookingId?: string
      customerName?: string
      notes?: string
    }
  }
}

interface BlockPeriod {
  id: string
  vehicleId: string
  startDate: Date
  endDate: Date
  reason: string
  notes?: string
}

const statusColors = {
  available: 'bg-green-100 text-green-700 border-green-200',
  booked: 'bg-blue-100 text-blue-700 border-blue-200',
  maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
  blocked: 'bg-red-100 text-red-700 border-red-200'
}

const statusIcons = {
  available: CheckCircle,
  booked: Car,
  maintenance: Wrench,
  blocked: XCircle
}

export default function AvailabilityPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [vehicles, setVehicles] = useState<VehicleAvailability[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')
  const [loading, setLoading] = useState(true)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [loadingBookingDetails, setLoadingBookingDetails] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(new Date())

  useEffect(() => {
    fetchAvailability()
  }, [currentMonth])

  const fetchAvailability = async () => {
    try {
      // Fetch bookings and vehicles from the API
      const [bookingsResponse, vehiclesResponse] = await Promise.all([
        fetch('/api/bookings?limit=100'),
        fetch('/api/vehicles')
      ])

      const bookings = await bookingsResponse.json()
      const vehiclesData = await vehiclesResponse.json()

      // Transform vehicles with availability data from bookings
      const vehiclesWithAvailability: VehicleAvailability[] = vehiclesData.map((vehicle: any) => {
        const availability: any = {}
        
        // Find bookings for this vehicle - include all active statuses
        const vehicleBookings = bookings.filter((booking: any) => 
          booking.car?.id === vehicle.id && 
          (booking.status === 'CONFIRMED' || 
           booking.status === 'PENDING' || 
           booking.status === 'IN_PROGRESS')
        )

        // Mark booked dates
        vehicleBookings.forEach((booking: any) => {
          const startDate = new Date(booking.startDate)
          const endDate = new Date(booking.endDate)
          const currentDate = new Date(startDate)

          while (currentDate <= endDate) {
            const dateStr = format(currentDate, 'yyyy-MM-dd')
            availability[dateStr] = {
              status: 'booked',
              bookingId: booking.id,
              customerName: booking.customer?.name || booking.guestName || 'Customer',
              notes: booking.customerNotes
            }
            currentDate.setDate(currentDate.getDate() + 1)
          }
        })

        return {
          id: vehicle.id,
          name: vehicle.displayName || `${vehicle.make} ${vehicle.model}`,
          plate: vehicle.licensePlate || 'N/A',
          category: vehicle.category || 'Standard',
          availability
        }
      })
      
      setVehicles(vehiclesWithAvailability)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch availability:', error)
      setVehicles([])
      setLoading(false)
    }
  }

  const fetchBookingDetails = async (bookingId: string) => {
    setLoadingBookingDetails(true)
    try {
      console.log('Fetching booking details for:', bookingId)
      const response = await fetch(`/api/bookings/${bookingId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Booking details received:', data)
      setBookingDetails(data)
    } catch (error) {
      console.error('Failed to fetch booking details:', error)
    } finally {
      setLoadingBookingDetails(false)
    }
  }

  const handleDateClick = (date: Date, vehicleId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return

    const availability = vehicle.availability[dateStr]
    if (!availability || availability.status === 'available') {
      // Toggle selection for blocking
      const isSelected = selectedDates.some(d => isSameDay(d, date))
      if (isSelected) {
        setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)))
      } else {
        setSelectedDates([...selectedDates, date])
      }
    } else if (availability.status === 'booked' && availability.bookingId) {
      // Show booking details modal
      setSelectedBooking({
        id: availability.bookingId,
        customerName: availability.customerName,
        vehicle: vehicle.name,
        date: date,
        status: availability.status
      })
      setShowBookingModal(true)
      // Fetch detailed booking information
      fetchBookingDetails(availability.bookingId)
    }
  }

  const handleBlockDates = () => {
    if (selectedDates.length > 0 && selectedVehicle !== 'all') {
      setShowBlockModal(true)
    }
  }

  const handleUnblockDate = (date: Date, vehicleId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const newAvailability = { ...v.availability }
        delete newAvailability[dateStr]
        return { ...v, availability: newAvailability }
      }
      return v
    }))
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    
    // Add padding days from previous month
    const startDay = getDay(start)
    const paddingDays = []
    for (let i = startDay - 1; i >= 0; i--) {
      paddingDays.push(addDays(start, -(i + 1)))
    }
    
    return [...paddingDays, ...days]
  }

  const getAvailabilityStats = () => {
    const days = getDaysInMonth().filter(d => isSameMonth(d, currentMonth))
    const stats = {
      total: 0,
      available: 0,
      booked: 0,
      maintenance: 0,
      blocked: 0
    }

    vehicles.forEach(vehicle => {
      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const availability = vehicle.availability[dateStr]
        stats.total++
        if (!availability) {
          stats.available++
        } else {
          stats[availability.status]++
        }
      })
    })

    return stats
  }

  const stats = getAvailabilityStats()
  const availabilityRate = stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Availability Calendar</h1>
          <p className="text-neutral-600 mt-2">Manage vehicle availability and block dates</p>
        </div>
        <div className="flex gap-2">
          {selectedDates.length > 0 && (
            <Button 
              onClick={handleBlockDates} 
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Block {selectedDates.length} Days
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Availability Rate</p>
              <p className="text-2xl font-bold text-neutral-900">{availabilityRate}%</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-amber-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Booked</p>
              <p className="text-2xl font-bold text-blue-600">{stats.booked}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">{stats.maintenance}</p>
            </div>
            <Wrench className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Blocked</p>
              <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Vehicles</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.plate})
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
              <option value="blocked">Blocked</option>
            </select>
            <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'month' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
                }`}
              >
                List
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (viewMode === 'month') {
                  setCurrentMonth(subMonths(currentMonth, 1))
                } else if (viewMode === 'week') {
                  setCurrentWeek(subWeeks(currentWeek, 1))
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 text-sm font-medium">
              {viewMode === 'month' 
                ? format(currentMonth, 'MMMM yyyy')
                : `${format(startOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMM d, yyyy')}`
              }
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (viewMode === 'month') {
                  setCurrentMonth(addMonths(currentMonth, 1))
                } else if (viewMode === 'week') {
                  setCurrentWeek(addWeeks(currentWeek, 1))
                }
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                if (viewMode === 'month') {
                  setCurrentMonth(today)
                } else if (viewMode === 'week') {
                  setCurrentWeek(today)
                }
              }}
            >
              Today
            </Button>
          </div>
        </div>
      </Card>

      {/* Week View */}
      {viewMode === 'week' && (
        <Card className="p-4">
          <div className="grid grid-cols-8 gap-px bg-neutral-200 rounded-lg overflow-hidden">
            {/* Time column header */}
            <div className="bg-neutral-50 p-2 text-center">
              <span className="text-xs font-medium text-neutral-600">Time</span>
            </div>
            
            {/* Week days header */}
            {(() => {
              const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
              const weekDays = []
              for (let i = 0; i < 7; i++) {
                const day = addDays(weekStart, i)
                weekDays.push(day)
              }
              return weekDays.map((day, idx) => (
                <div key={idx} className="bg-neutral-50 p-2 text-center">
                  <div className="text-xs font-medium text-neutral-600">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-sm font-medium ${
                    isToday(day) ? 'text-amber-600' : 'text-neutral-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))
            })()}
            
            {/* Time slots and bookings */}
            {(() => {
              const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
              const weekDays = []
              for (let i = 0; i < 7; i++) {
                weekDays.push(addDays(weekStart, i))
              }
              
              // Show full day view
              return (
                <>
                  <div className="bg-white p-2 text-xs text-neutral-600">All Day</div>
                  {weekDays.map((day, dayIdx) => {
                    const dateStr = format(day, 'yyyy-MM-dd')
                    const vehicleBookings = (selectedVehicle === 'all' ? vehicles : vehicles.filter(v => v.id === selectedVehicle))
                      .filter(v => v.availability[dateStr] && v.availability[dateStr].status !== 'available')
                    
                    return (
                      <div key={dayIdx} className="bg-white p-2 min-h-[120px]">
                        <div className="space-y-1">
                          {vehicleBookings.slice(0, 3).map(vehicle => {
                            const availability = vehicle.availability[dateStr]
                            const Icon = statusIcons[availability.status]
                            return (
                              <div
                                key={vehicle.id}
                                className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${
                                  statusColors[availability.status]
                                } border transition-all hover:shadow-sm cursor-pointer`}
                                onClick={() => handleDateClick(day, vehicle.id)}
                                title={`${vehicle.name} - ${availability.customerName}`}
                              >
                                <Icon className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate text-xs">
                                  {vehicle.name}
                                </span>
                              </div>
                            )
                          })}
                          {vehicleBookings.length > 3 && (
                            <div className="text-xs text-neutral-500 pl-1">
                              +{vehicleBookings.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </>
              )
            })()}
          </div>
          
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'month' && (
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-px bg-neutral-200 rounded-lg overflow-hidden">
            {/* Week days header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-neutral-50 p-2 text-center">
                <span className="text-xs font-medium text-neutral-600">{day}</span>
              </div>
            ))}
            
            {/* Calendar days */}
            {getDaysInMonth().map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isSelected = selectedDates.some(d => isSameDay(d, day))
              
              return (
                <div
                  key={idx}
                  className={`bg-white p-2 min-h-[100px] ${
                    !isCurrentMonth ? 'opacity-50' : ''
                  } ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${
                      isToday(day) ? 'text-amber-600' : 'text-neutral-900'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {isToday(day) && (
                      <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                        Today
                      </span>
                    )}
                  </div>
                  
                  {/* Vehicle availability for this day */}
                  <div className="space-y-1">
                    {(selectedVehicle === 'all' ? vehicles : vehicles.filter(v => v.id === selectedVehicle))
                      .slice(0, 3) // Show max 3 bookings per day for cleaner design
                      .map(vehicle => {
                        const availability = vehicle.availability[dateStr]
                        if (!availability || availability.status === 'available') {
                          return null
                        }
                        
                        const Icon = statusIcons[availability.status]
                        return (
                          <div
                            key={vehicle.id}
                            className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 ${
                              statusColors[availability.status]
                            } border transition-all hover:shadow-sm cursor-pointer`}
                            onClick={() => handleDateClick(day, vehicle.id)}
                            title={`${vehicle.name} - ${availability.customerName}`}
                          >
                            <Icon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate font-medium">
                              {availability.customerName ? `${vehicle.name} - ${availability.customerName.split(' ')[0]}` : vehicle.name}
                            </span>
                          </div>
                        )
                      })}
                    {/* Show count if more than 3 bookings */}
                    {vehicles.filter(v => v.availability[dateStr] && v.availability[dateStr].status !== 'available').length > 3 && (
                      <div className="text-xs text-neutral-500 font-medium pl-1">
                        +{vehicles.filter(v => v.availability[dateStr] && v.availability[dateStr].status !== 'available').length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-sm font-medium text-neutral-700">Legend:</span>
            {Object.entries(statusColors).map(([status, color]) => {
              const Icon = statusIcons[status as keyof typeof statusIcons]
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded ${color} border flex items-center justify-center`}>
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-sm text-neutral-600 capitalize">{status}</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Vehicle</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Customer/Notes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vehicles.flatMap(vehicle => 
                  Object.entries(vehicle.availability).map(([dateStr, availability]) => {
                    const date = new Date(dateStr)
                    if (!isSameMonth(date, currentMonth)) return null
                    if (filterStatus !== 'all' && availability.status !== filterStatus) return null
                    
                    const Icon = statusIcons[availability.status]
                    return (
                      <tr key={`${vehicle.id}-${dateStr}`} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-neutral-900">
                            {format(date, 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {format(date, 'EEEE')}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-neutral-900">{vehicle.name}</p>
                          <p className="text-xs text-neutral-600">{vehicle.plate}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                            statusColors[availability.status]
                          } border`}>
                            <Icon className="h-3.5 w-3.5" />
                            <span className="text-sm font-medium capitalize">{availability.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {availability.customerName && (
                            <p className="text-sm text-neutral-900">{availability.customerName}</p>
                          )}
                          {availability.bookingId && (
                            <p className="text-xs text-neutral-600">{availability.bookingId}</p>
                          )}
                          {availability.notes && (
                            <p className="text-xs text-neutral-600">{availability.notes}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {availability.status === 'blocked' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUnblockDate(date, vehicle.id)}
                              >
                                Unblock
                              </Button>
                            )}
                            {availability.bookingId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedBooking({
                                    id: availability.bookingId,
                                    customerName: availability.customerName,
                                    vehicle: vehicle.name,
                                    date: date,
                                    status: availability.status
                                  })
                                  setShowBookingModal(true)
                                  fetchBookingDetails(availability.bookingId!)
                                }}
                              >
                                View Booking
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  }).filter(Boolean)
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Block Dates Modal */}
      {showBlockModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowBlockModal(false)
              setSelectedDates([])
            }
          }}
        >
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Block Selected Dates</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Selected Dates
                  </label>
                  <div className="text-sm text-neutral-600">
                    {selectedDates.map(d => format(d, 'MMM dd, yyyy')).join(', ')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Reason
                  </label>
                  <select className="w-full px-3 py-2 pr-8 border rounded-lg appearance-none bg-white">
                    <option>Maintenance</option>
                    <option>Private Event</option>
                    <option>Reserved</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Add any additional notes..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBlockModal(false)
                      setSelectedDates([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle blocking dates
                      setShowBlockModal(false)
                      setSelectedDates([])
                    }}
                  >
                    Block Dates
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Comprehensive Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowBookingModal(false)
              setSelectedBooking(null)
              setBookingDetails(null)
            }
          }}
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Card className="w-full">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      {bookingDetails?.customer?.name || selectedBooking.customerName || 'Customer'} - {bookingDetails?.vehicle?.displayName || bookingDetails?.car?.displayName || selectedBooking.vehicle || 'Vehicle'}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Booking #{bookingDetails?.id || selectedBooking.id} • Created on {format(selectedBooking.date, 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowBookingModal(false)
                      setSelectedBooking(null)
                      setBookingDetails(null)
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                {loadingBookingDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : bookingDetails ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Customer Information */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Customer Information
                        </h4>
                        <div className="space-y-3">
                            <div>
                              <label className="text-sm text-neutral-600">Name</label>
                              <p className="font-medium text-neutral-900">{bookingDetails.customer?.name || selectedBooking.customerName || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600">Email</label>
                              <p className="font-medium text-neutral-900">{bookingDetails.customer?.email || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600">Phone</label>
                              <p className="font-medium text-neutral-900">{bookingDetails.customer?.phone || 'N/A'}</p>
                            </div>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          Vehicle Details
                        </h4>
                        <div className="space-y-3">
                            <div>
                              <label className="text-sm text-neutral-600">Vehicle</label>
                              <p className="font-medium text-neutral-900">{bookingDetails.vehicle?.displayName || bookingDetails.car?.displayName || selectedBooking.vehicle || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600">Make/Model</label>
                              <p className="font-medium text-neutral-900">
                                {(bookingDetails.vehicle?.make && bookingDetails.vehicle?.model) 
                                  ? `${bookingDetails.vehicle.make} ${bookingDetails.vehicle.model}`
                                  : (bookingDetails.car?.make && bookingDetails.car?.model)
                                  ? `${bookingDetails.car.make} ${bookingDetails.car.model}`
                                  : 'N/A'
                                }
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600">Year</label>
                              <p className="font-medium text-neutral-900">{bookingDetails.vehicle?.year || bookingDetails.car?.year || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600">Category</label>
                              <p className="font-medium text-neutral-900">{bookingDetails.vehicle?.category || bookingDetails.car?.category || 'N/A'}</p>
                            </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Rental Details */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <CalendarDays className="h-5 w-5" />
                          Rental Details
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-neutral-600">Pickup</label>
                            <p className="font-medium text-neutral-900">
                              {format(new Date(bookingDetails.startDate), 'MMM dd, yyyy')} at {bookingDetails.startTime}
                            </p>
                            <p className="text-sm text-neutral-600">{bookingDetails.pickupLocation || 'Showroom'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-neutral-600">Return</label>
                            <p className="font-medium text-neutral-900">
                              {format(new Date(bookingDetails.endDate), 'MMM dd, yyyy')} at {bookingDetails.endTime}
                            </p>
                            <p className="text-sm text-neutral-600">{bookingDetails.returnLocation || 'Showroom'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4">Status</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-neutral-600">Booking Status</label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                bookingDetails.status === 'CONFIRMED' ? 'bg-green-500' :
                                bookingDetails.status === 'PENDING' ? 'bg-yellow-500' :
                                bookingDetails.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                bookingDetails.status === 'COMPLETED' ? 'bg-green-600' :
                                bookingDetails.status === 'CANCELLED' ? 'bg-red-500' :
                                'bg-gray-400'
                              }`} />
                              <span className={`font-medium ${
                                bookingDetails.status === 'CONFIRMED' ? 'text-green-700' :
                                bookingDetails.status === 'PENDING' ? 'text-yellow-700' :
                                bookingDetails.status === 'IN_PROGRESS' ? 'text-blue-700' :
                                bookingDetails.status === 'COMPLETED' ? 'text-green-700' :
                                bookingDetails.status === 'CANCELLED' ? 'text-red-700' :
                                'text-gray-700'
                              }`}>
                                {bookingDetails.status === 'CONFIRMED' ? 'Confirmed' :
                                 bookingDetails.status === 'PENDING' ? 'Pending' :
                                 bookingDetails.status === 'IN_PROGRESS' ? 'In Progress' :
                                 bookingDetails.status === 'COMPLETED' ? 'Completed' :
                                 bookingDetails.status === 'CANCELLED' ? 'Cancelled' :
                                 bookingDetails.status || 'Unknown'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-neutral-600">Payment Status</label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                bookingDetails.paymentStatus === 'PAID' ? 'bg-green-500' :
                                bookingDetails.paymentStatus === 'PENDING' ? 'bg-yellow-500' :
                                bookingDetails.paymentStatus === 'PROCESSING' ? 'bg-blue-500' :
                                bookingDetails.paymentStatus === 'FAILED' ? 'bg-red-500' :
                                bookingDetails.paymentStatus === 'REFUNDED' ? 'bg-purple-500' :
                                bookingDetails.paymentStatus === 'PARTIALLY_REFUNDED' ? 'bg-orange-500' :
                                'bg-gray-400'
                              }`} />
                              <span className={`font-medium ${
                                bookingDetails.paymentStatus === 'PAID' ? 'text-green-700' :
                                bookingDetails.paymentStatus === 'PENDING' ? 'text-yellow-700' :
                                bookingDetails.paymentStatus === 'PROCESSING' ? 'text-blue-700' :
                                bookingDetails.paymentStatus === 'FAILED' ? 'text-red-700' :
                                bookingDetails.paymentStatus === 'REFUNDED' ? 'text-purple-700' :
                                bookingDetails.paymentStatus === 'PARTIALLY_REFUNDED' ? 'text-orange-700' :
                                'text-gray-700'
                              }`}>
                                {bookingDetails.paymentStatus === 'PAID' ? 'Paid' :
                                 bookingDetails.paymentStatus === 'PENDING' ? 'Pending' :
                                 bookingDetails.paymentStatus === 'PROCESSING' ? 'Processing' :
                                 bookingDetails.paymentStatus === 'FAILED' ? 'Failed' :
                                 bookingDetails.paymentStatus === 'REFUNDED' ? 'Refunded' :
                                 bookingDetails.paymentStatus === 'PARTIALLY_REFUNDED' ? 'Partially Refunded' :
                                 bookingDetails.paymentStatus || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Payment Summary
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Base Amount</span>
                            <span className="font-medium">${bookingDetails.basePriceTotal || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Add-ons</span>
                            <span className="font-medium">${bookingDetails.addOnsTotal || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Fees</span>
                            <span className="font-medium">${bookingDetails.feesTotal || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Tax</span>
                            <span className="font-medium">${bookingDetails.taxTotal || 0}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${bookingDetails.totalAmount || 0}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Paid</span>
                            <span>${bookingDetails.totalAmount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Balance</span>
                            <span>$0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-600">Failed to load booking details</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const subject = `Booking Confirmation - ${bookingDetails?.bookingNumber || bookingDetails?.id}`
                        const body = `Dear ${bookingDetails?.customer?.name || 'Customer'},\n\nYour booking has been confirmed!\n\nBooking Details:\n- Booking ID: ${bookingDetails?.id}\n- Vehicle: ${bookingDetails?.vehicle?.displayName || 'N/A'}\n- Pick-up Date: ${bookingDetails?.startDate ? format(new Date(bookingDetails.startDate), 'MMM dd, yyyy') : 'N/A'} at ${bookingDetails?.startTime || '10:00 AM'}\n- Return Date: ${bookingDetails?.endDate ? format(new Date(bookingDetails.endDate), 'MMM dd, yyyy') : 'N/A'} at ${bookingDetails?.endTime || '10:00 AM'}\n- Pick-up Location: ${bookingDetails?.pickupLocation || 'Showroom'}\n- Return Location: ${bookingDetails?.returnLocation || 'Showroom'}\n- Total Amount: $${bookingDetails?.totalAmount || 0}\n\nPayment Status: ${bookingDetails?.paymentStatus || 'N/A'}\n\nThank you for choosing us!\n\nBest regards,\nFlyRentals Team`
                        const mailtoLink = `mailto:${bookingDetails?.customer?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                        window.open(mailtoLink, '_blank')
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Send Confirmation</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Activity Timeline */}
                {bookingDetails && (
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Activity Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-neutral-900">Booking Created</p>
                          <p className="text-sm text-neutral-600">
                            {format(new Date(bookingDetails.createdAt), 'MMM dd, yyyy h:mm a')} by {bookingDetails.customer?.name}
                          </p>
                        </div>
                      </div>
                      {bookingDetails.paymentStatus === 'PAID' && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-neutral-900">Payment Completed</p>
                            <p className="text-sm text-neutral-600">
                              {format(new Date(bookingDetails.updatedAt), 'MMM dd, yyyy h:mm a')} - Payment processed successfully
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-neutral-900">Booking Confirmed</p>
                          <p className="text-sm text-neutral-600">
                            {format(new Date(bookingDetails.updatedAt), 'MMM dd, yyyy h:mm a')} - Booking confirmed and ready
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

