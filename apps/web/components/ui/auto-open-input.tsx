'use client'

import { forwardRef, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface AutoOpenInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  autoOpen?: boolean
}

const AutoOpenInput = forwardRef<HTMLInputElement, AutoOpenInputProps>(
  ({ className, autoOpen = false, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (autoOpen && inputRef.current) {
        inputRef.current.focus()
      }
    }, [autoOpen])

    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref || inputRef}
        {...props}
      />
    )
  }
)
AutoOpenInput.displayName = "AutoOpenInput"

export { AutoOpenInput }