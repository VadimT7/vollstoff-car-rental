'use client'

import { useEffect } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function GlobalError({
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
    <html>
      <body>
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
              <button 
                onClick={reset}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              
              <div className="text-neutral-400 text-sm">
                <a href="/contact" className="hover:text-amber-500 transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
