'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarWithAvailabilityProps {
  value: string
  onChange: (date: string) => void
  min?: string
  max?: string
  disabled?: boolean
  blockedDates?: Record<string, { booked: boolean, reason?: string }>
  carId?: string
  label?: string
  required?: boolean
  className?: string
  id?: string
}

export function CalendarWithAvailability({
  value,
  onChange,
  min,
  max,
  disabled = false,
  blockedDates: initialBlockedDates = {},
  carId,
  label,
  required = false,
  className,
  id
}: CalendarWithAvailabilityProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates)
  const [loading, setLoading] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)

  // Fetch availability when calendar opens
  useEffect(() => {
    if (isOpen && carId && Object.keys(blockedDates).length === 0) {
      fetchAvailability()
    }
  }, [isOpen, carId])

  // Update blocked dates when prop changes
  useEffect(() => {
    setBlockedDates(initialBlockedDates)
  }, [initialBlockedDates])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current && 
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchAvailability = async () => {
    if (!carId) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/availability?carId=${carId}`)
      if (response.ok) {
        const data = await response.json()
        setBlockedDates(data.blockedDates || {})
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const parseDate = (dateString: string) => {
    if (!dateString) return null
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const isDateDisabled = (date: Date) => {
    const dateStr = formatDate(date)
    
    // Check if date is before min
    if (min && dateStr < min) return true
    
    // Check if date is after max
    if (max && dateStr > max) return true
    
    // Check if date is blocked
    if (blockedDates[dateStr]) return true
    
    return false
  }

  const isDateBooked = (date: Date) => {
    const dateStr = formatDate(date)
    return blockedDates[dateStr]?.booked === true
  }

  const isDateBlocked = (date: Date) => {
    const dateStr = formatDate(date)
    return blockedDates[dateStr] && !blockedDates[dateStr].booked
  }

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return
    
    const dateStr = formatDate(date)
    onChange(dateStr)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const selectedDate = parseDate(value)
  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = parseDate(dateString)
    if (!date) return ''
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Input Field - Clickable anywhere */}
      <div
        ref={inputRef}
        onClick={() => !disabled && setIsOpen(true)}
        className={cn(
          "relative flex items-center w-full h-10 px-3 py-2 border border-gray-300 rounded-md cursor-pointer transition-all min-w-0",
          "hover:border-gray-400 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500",
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : "bg-white",
          isOpen && "ring-2 ring-amber-500 border-amber-500"
        )}
      >
        <Calendar className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
        <input
          id={id}
          type="text"
          value={formatDisplayDate(value)}
          placeholder="Select date"
          readOnly
          disabled={disabled}
          className="flex-1 bg-transparent border-0 outline-none cursor-pointer text-sm min-w-0 focus:ring-0 focus:border-0"
        />
        {value && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            className="ml-2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div
          ref={calendarRef}
          className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-[300px] left-0"
          style={{
            maxWidth: 'calc(100vw - 2rem)',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-neutral-100 rounded"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="font-semibold text-slate-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-neutral-100 rounded"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-9" />
                  }

                  const dateStr = formatDate(date)
                  const isSelected = selectedDate && formatDate(selectedDate) === dateStr
                  const isDisabled = isDateDisabled(date)
                  const isBooked = isDateBooked(date)
                  const isBlocked = isDateBlocked(date)
                  const isToday = formatDate(new Date()) === dateStr

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateSelect(date)}
                      disabled={isDisabled}
                      className={cn(
                        "h-9 w-9 rounded-md text-sm font-medium transition-all relative flex items-center justify-center",
                        isSelected && "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
                        !isSelected && !isDisabled && "hover:bg-gray-100 text-gray-700",
                        !isSelected && isToday && "bg-amber-50 text-amber-600 font-semibold",
                        isDisabled && "opacity-50 cursor-not-allowed text-gray-400",
                        isBooked && "bg-red-50 text-red-500 cursor-not-allowed hover:bg-red-50",
                        isBlocked && "bg-gray-50 text-gray-400 cursor-not-allowed hover:bg-gray-50"
                      )}
                      title={
                        isBooked ? "Already booked" : 
                        isBlocked ? blockedDates[dateStr]?.reason || "Unavailable" : 
                        undefined
                      }
                    >
                      {date.getDate()}
                      {isBooked && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-red-50 border border-red-200 rounded-sm" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded-sm" />
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CalendarWithAvailability
