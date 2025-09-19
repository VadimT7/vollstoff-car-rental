'use client'

import { useRef } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClickableTimeInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  label?: string
  required?: boolean
  className?: string
  id?: string
}

export function ClickableTimeInput({
  value,
  onChange,
  disabled = false,
  label,
  required = false,
  className,
  id
}: ClickableTimeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker()
      } else {
        inputRef.current.focus()
      }
    }
  }

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return ''
    try {
      const [hours, minutes] = timeString.split(':')
      const hour12 = parseInt(hours) % 12 || 12
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
      return `${hour12}:${minutes} ${ampm}`
    } catch {
      return timeString
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Clickable Container */}
      <div
        onClick={handleContainerClick}
        className={cn(
          "relative flex items-center w-full h-10 px-3 py-2 border border-gray-300 rounded-md cursor-pointer transition-all min-w-0",
          "hover:border-gray-400 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500",
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : "bg-white"
        )}
      >
        <Clock className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
        
        {/* Hidden native time input */}
        <input
          ref={inputRef}
          id={id}
          type="time"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* Display input */}
        <input
          type="text"
          value={formatDisplayTime(value)}
          placeholder="Select time"
          readOnly
          disabled={disabled}
          className="flex-1 bg-transparent border-0 outline-none cursor-pointer text-sm min-w-0 truncate focus:ring-0 focus:border-0"
        />
      </div>
    </div>
  )
}

export default ClickableTimeInput
