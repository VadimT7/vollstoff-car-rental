'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { Input } from '@valore/ui'
import { AvailabilityCalendar } from './availability-calendar'

interface DateInputWithAvailabilityProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: string
  blockedDates: Record<string, { booked: boolean, reason?: string }>
  placeholder?: string
  className?: string
}

export function DateInputWithAvailability({ 
  value, 
  onChange, 
  min, 
  blockedDates, 
  placeholder,
  className 
}: DateInputWithAvailabilityProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDateSelect = (date: string) => {
    // Create a synthetic event to match the onChange signature
    const syntheticEvent = {
      target: { value: date },
      currentTarget: { value: date }
    } as React.ChangeEvent<HTMLInputElement>
    
    onChange(syntheticEvent)
    setShowCalendar(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div 
        className="relative cursor-pointer"
        onClick={() => setShowCalendar(true)}
      >
        <Input
          type="text"
          value={value}
          readOnly
          placeholder={placeholder || 'Select date'}
          className={`cursor-pointer pr-10 ${className || ''}`}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {showCalendar && (
        <AvailabilityCalendar
          value={value}
          onChange={handleDateSelect}
          min={min}
          blockedDates={blockedDates}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  )
}
