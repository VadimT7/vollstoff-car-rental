'use client'

import { Calendar } from 'lucide-react'

interface DateInputWithAvailabilityProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: string
  max?: string
  disabled?: boolean
  blockedDates?: Record<string, { booked: boolean, reason?: string }>
}

export function DateInputWithAvailability({
  value,
  onChange,
  min,
  max,
  disabled = false,
  blockedDates = {}
}: DateInputWithAvailabilityProps) {
  return (
    <div className="relative">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="date"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
          className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}

export default DateInputWithAvailability