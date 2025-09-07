import { NextRequest, NextResponse } from 'next/server'
import db from '@valore/database'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id
    const body = await request.json()

    console.log(`🔄 Updating booking ${bookingId} with data:`, body)

    // Validate required fields
    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {}

    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (body.pickupLocation !== undefined) updateData.pickupLocation = body.pickupLocation
    if (body.returnLocation !== undefined) updateData.returnLocation = body.returnLocation
    if (body.customerNotes !== undefined) updateData.customerNotes = body.customerNotes
    if (body.internalNotes !== undefined) updateData.internalNotes = body.internalNotes
    if (body.status) updateData.status = body.status
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus
    if (body.basePriceTotal !== undefined) updateData.basePriceTotal = body.basePriceTotal
    if (body.addOnsTotal !== undefined) updateData.addOnsTotal = body.addOnsTotal
    if (body.feesTotal !== undefined) updateData.feesTotal = body.feesTotal
    if (body.taxTotal !== undefined) updateData.taxTotal = body.taxTotal
    if (body.totalAmount !== undefined) updateData.totalAmount = body.totalAmount

    // Add timestamps for status changes
    if (body.status === 'CONFIRMED' && !updateData.confirmedAt) {
      updateData.confirmedAt = new Date()
    }
    if (body.status === 'CANCELLED' && !updateData.cancelledAt) {
      updateData.cancelledAt = new Date()
    }
    if (body.status === 'COMPLETED' && !updateData.completedAt) {
      updateData.completedAt = new Date()
    }

    // Update the booking
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isVerified: true
          }
        },
        car: {
          select: {
            id: true,
            displayName: true,
            make: true,
            model: true,
            year: true,
            category: true,
            primaryImageUrl: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            type: true,
            method: true,
            createdAt: true
          }
        }
      }
    })

    console.log(`✅ Successfully updated booking ${bookingId}`)

    return NextResponse.json({
      success: true,
      booking: updatedBooking
    })

  } catch (error) {
    console.error('❌ Failed to update booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id

    console.log(`🔍 Fetching booking ${bookingId}`)

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isVerified: true
          }
        },
        car: {
          select: {
            id: true,
            displayName: true,
            make: true,
            model: true,
            year: true,
            category: true,
            primaryImageUrl: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            type: true,
            method: true,
            createdAt: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    console.log(`✅ Found booking ${bookingId}`)

    return NextResponse.json(booking)

  } catch (error) {
    console.error('❌ Failed to fetch booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}
