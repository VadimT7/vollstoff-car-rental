'use client'

import { useRef, useEffect } from 'react'
import { Input } from '@valore/ui'

interface AutoOpenInputProps {
  type: 'date' | 'time'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: string
  max?: string
  id?: string
  className?: string
  placeholder?: string
}

export function AutoOpenInput({ type, value, onChange, min, max, id, className, placeholder }: AutoOpenInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (inputRef.current) {
      // For date inputs
      if (type === 'date' && 'showPicker' in inputRef.current) {
        (inputRef.current as any).showPicker()
      }
      // For time inputs
      else if (type === 'time' && 'showPicker' in inputRef.current) {
        (inputRef.current as any).showPicker()
      }
      // Fallback for browsers that don't support showPicker
      else {
        inputRef.current.focus()
        inputRef.current.click()
      }
    }
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        id={id}
        className={className}
        placeholder={placeholder || (type === 'date' ? 'yyyy-mm-dd' : '10:00 AM')}
      />
    </div>
  )
}
