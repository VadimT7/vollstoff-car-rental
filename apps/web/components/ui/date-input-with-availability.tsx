'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface DateInputWithAvailabilityProps {
  label: string
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export function DateInputWithAvailability({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false
}: DateInputWithAvailabilityProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null
    onChange(date)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="date"
          value={value ? format(value, 'yyyy-MM-dd') : ''}
          onChange={handleDateChange}
          min={minDate ? format(minDate, 'yyyy-MM-dd') : undefined}
          max={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
          disabled={disabled}
          className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}

export default DateInputWithAvailability