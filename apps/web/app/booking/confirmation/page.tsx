import { Suspense } from 'react'
import BookingConfirmationClient from './client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmationClient />
    </Suspense>
  )
}