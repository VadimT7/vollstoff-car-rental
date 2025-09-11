'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Badge } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const statusConfig = {
  PENDING: { label: 'Pending', color: 'warning' },
  CONFIRMED: { label: 'Confirmed', color: 'info' },
  IN_PROGRESS: { label: 'Active', color: 'success' },
  COMPLETED: { label: 'Completed', color: 'default' },
  CANCELLED: { label: 'Cancelled', color: 'destructive' },
  NO_SHOW: { label: 'No Show', color: 'destructive' },
}

const paymentStatusConfig = {
  PENDING: { label: 'Pending', color: 'warning' },
  PAID: { label: 'Paid', color: 'success' },
  PARTIALLY_REFUNDED: { label: 'Partial Refund', color: 'warning' },
  REFUNDED: { label: 'Refunded', color: 'default' },
  FAILED: { label: 'Failed', color: 'destructive' },
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      console.log('📋 Fetching recent bookings for dashboard...')
      const response = await fetch('/api/bookings')
      
      if (response.ok) {
        const bookingsData = await response.json()
        // Take only the 5 most recent bookings for dashboard
        const recentBookings = bookingsData.slice(0, 5)
        console.log(`✅ Loaded ${recentBookings.length} recent bookings for dashboard`)
        setBookings(recentBookings)
      } else {
        console.log('⚠️ No bookings API available, showing empty state')
        setBookings([])
      }
    } catch (error) {
      console.log('⚠️ Bookings API not available, showing empty state')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No bookings yet. Bookings will appear here once customers make reservations.</p>
        <Link
          href="/bookings"
          className="text-sm text-primary hover:text-primary/80 font-medium mt-4 inline-block"
        >
          View all bookings →
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Total</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const status = statusConfig[booking.status as keyof typeof statusConfig]
            const paymentStatus = paymentStatusConfig[booking.paymentStatus as keyof typeof paymentStatusConfig]
            
            return (
              <tr key={booking.id}>
                <td>
                  <p className="font-medium">{booking.bookingNumber}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {format(new Date(booking.startDate), 'MMM d, h:mm a')}
                  </p>
                </td>
                <td>
                  <p className="font-medium">{booking.customer?.name || 'Guest'}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {booking.customer?.email || booking.guestEmail}
                  </p>
                </td>
                <td>{booking.car?.displayName}</td>
                <td>
                  <p>{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d')}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </td>
                <td>
                  <Badge variant={status.color as any}>
                    {status.label}
                  </Badge>
                </td>
                <td>
                  <Badge variant={paymentStatus.color as any} size="sm">
                    {paymentStatus.label}
                  </Badge>
                </td>
                <td className="font-medium">
                  ${Number(booking.totalAmount).toLocaleString()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
      <div className="mt-4 text-center">
        <Link
          href="/bookings"
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          View all bookings →
        </Link>
      </div>
    </div>
  )
}