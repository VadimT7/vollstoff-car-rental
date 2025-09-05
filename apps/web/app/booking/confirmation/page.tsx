import { Suspense } from 'react'
import BookingConfirmationClient from './client'

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmationClient />
    </Suspense>
  )
}