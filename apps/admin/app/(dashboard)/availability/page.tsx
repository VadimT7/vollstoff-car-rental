'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Car,
  AlertCircle,
  CheckCircle,
  XCircle,
  Wrench,
  Plus,
  Filter,
  Settings
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
  differenceInDays
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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [vehicles, setVehicles] = useState<VehicleAvailability[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')
  const [loading, setLoading] = useState(true)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')

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
        
        // Find bookings for this vehicle
        const vehicleBookings = bookings.filter((booking: any) => 
          booking.car?.id === vehicle.id && 
          (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
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
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 text-sm font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
          </div>
        </div>
      </Card>

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
    </div>
  )
}

