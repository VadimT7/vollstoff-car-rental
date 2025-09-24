import Link from 'next/link'
import { Button } from '@valore/ui'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="text-center px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-amber-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-neutral-300 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
              Return Home
            </Button>
          </Link>
          
          <div className="text-neutral-400 text-sm">
            <Link href="/fleet" className="hover:text-amber-500 transition-colors">
              Browse Our Fleet
            </Link>
            {' • '}
            <Link href="/contact" className="hover:text-amber-500 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
