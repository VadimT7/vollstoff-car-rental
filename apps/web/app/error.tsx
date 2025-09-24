'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@valore/ui'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="text-center px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-500 mb-4">500</h1>
          <h2 className="text-3xl font-semibold text-white mb-4">Something went wrong!</h2>
          <p className="text-neutral-300 text-lg mb-8 max-w-md mx-auto">
            We're experiencing technical difficulties. Please try again or contact support if the problem persists.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={reset}
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Try Again
            </Button>
            
            <Link href="/">
              <Button 
                size="lg" 
                variant="outline"
                className="border-neutral-600 text-white hover:bg-neutral-700"
              >
                Return Home
              </Button>
            </Link>
          </div>
          
          <div className="text-neutral-400 text-sm">
            <Link href="/contact" className="hover:text-amber-500 transition-colors">
              Contact Support
            </Link>
            {' • '}
            <Link href="/fleet" className="hover:text-amber-500 transition-colors">
              Browse Our Fleet
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
