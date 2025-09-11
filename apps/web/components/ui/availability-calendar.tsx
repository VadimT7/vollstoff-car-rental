'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay } from 'date-fns'

interface AvailabilityCalendarProps {
  value: string
  onChange: (date: string) => void
  min?: string
  blockedDates: Record<string, { booked: boolean, reason?: string }>
  onClose?: () => void
}

export function AvailabilityCalendar({ value, onChange, min, blockedDates, onClose }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)

  const minDate = min ? new Date(min) : new Date()

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    
    // Add padding days from previous month
    const startDay = start.getDay()
    const paddingDays = []
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(start)
      date.setDate(date.getDate() - (i + 1))
      paddingDays.push(date)
    }
    
    // Add padding days from next month
    const endDay = end.getDay()
    const remainingDays = []
    for (let i = 1; i <= (6 - endDay); i++) {
      const date = new Date(end)
      date.setDate(date.getDate() + i)
      remainingDays.push(date)
    }
    
    return [...paddingDays, ...days, ...remainingDays]
  }

  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return blockedDates[dateStr]?.booked || false
  }

  const isDateDisabled = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(minDate)) || isDateBlocked(date)
  }

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date)
      onChange(format(date, 'yyyy-MM-dd'))
      if (onClose) {
        setTimeout(onClose, 200) // Small delay for visual feedback
      }
    }
  }

  return (
    <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth().map((date, idx) => {
          const isCurrentMonth = isSameMonth(date, currentMonth)
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isBlockedDate = isDateBlocked(date)
          const isDisabled = isDateDisabled(date)
          const dateStr = format(date, 'yyyy-MM-dd')
          const blockInfo = blockedDates[dateStr]

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`
                relative p-2 text-sm rounded-lg transition-all
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isToday(date) && !isSelected ? 'bg-amber-50 text-amber-900 font-medium' : ''}
                ${isSelected ? 'bg-amber-500 text-white font-bold' : ''}
                ${isBlockedDate ? 'bg-red-100 text-red-400 cursor-not-allowed line-through' : ''}
                ${isDisabled && !isBlockedDate ? 'text-gray-300 cursor-not-allowed' : ''}
                ${!isDisabled && !isSelected && isCurrentMonth ? 'hover:bg-gray-100 text-gray-900' : ''}
              `}
              title={blockInfo ? `Booked` : ''}
            >
              <span className="relative">
                {format(date, 'd')}
                {isBlockedDate && (
                  <X className="absolute -top-1 -right-1 w-3 h-3 text-red-500" />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center">
            <X className="w-3 h-3 text-red-500" />
          </div>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
      </div>
    </div>
  )
}
