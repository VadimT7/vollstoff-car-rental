import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

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

    // Get current booking data before update to check for status changes
    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        carId: true,
        startDate: true,
        endDate: true,
        status: true,
        bookingNumber: true,
      }
    })

    if (!currentBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

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
    const updatedBooking = await prisma.booking.update({
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

    // If booking was cancelled, free up the availability
    if (body.status === 'CANCELLED' && currentBooking.status !== 'CANCELLED') {
      console.log(`🗓️ Freeing up availability for cancelled booking ${bookingId}`)
      
      await prisma.availability.deleteMany({
        where: {
          carId: currentBooking.carId,
          date: {
            gte: currentBooking.startDate,
            lte: currentBooking.endDate,
          },
          reason: 'BOOKED',
        },
      })
      
      console.log(`✅ Availability freed up for booking ${currentBooking.bookingNumber}`)
    }

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

    // Fetch booking with all related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        car: {
          select: {
            id: true,
            displayName: true,
            make: true,
            model: true,
            year: true,
            category: true,
            primaryImageUrl: true,
            licensePlate: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            licenseNumber: true,
            isVerified: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            type: true,
            method: true,
            createdAt: true,
          }
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format
    const transformedBooking = {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      startDate: booking.startDate,
      endDate: booking.endDate,
      startTime: (booking as any).startTime || '10:00 AM',
      endTime: (booking as any).endTime || '10:00 AM',
      pickupLocation: booking.pickupLocation,
      returnLocation: booking.returnLocation,
      totalAmount: booking.totalAmount,
      basePriceTotal: booking.basePriceTotal,
      addOnsTotal: booking.addOnsTotal,
      feesTotal: booking.feesTotal,
      taxTotal: booking.taxTotal,
      includedKm: booking.includedKm,
      customerNotes: booking.customerNotes,
      internalNotes: booking.internalNotes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      // Customer info (from user or guest fields)
      customer: booking.user ? {
        id: booking.user.id,
        name: booking.user.name || (booking as any).guestName,
        email: booking.user.email || (booking as any).guestEmail,
        phone: booking.user.phone || (booking as any).guestPhone,
        licenseNumber: booking.user.licenseNumber || (booking as any).guestLicense,
        address: null,
      } : {
        name: (booking as any).guestName,
        email: (booking as any).guestEmail,
        phone: (booking as any).guestPhone,
        licenseNumber: (booking as any).guestLicense,
        address: null,
      },
      // Vehicle info (keep both car and vehicle for compatibility)
      car: booking.car,
      vehicle: booking.car ? {
        id: booking.car.id,
        displayName: booking.car.displayName,
        make: booking.car.make,
        model: booking.car.model,
        year: booking.car.year,
        category: booking.car.category,
        primaryImageUrl: booking.car.primaryImageUrl,
        licensePlate: booking.car.licensePlate,
      } : null,
      // Payment info
      payments: booking.payments,
    }

    console.log(`✅ Booking ${bookingId} details fetched successfully`)

    return NextResponse.json(transformedBooking)

  } catch (error) {
    console.error('❌ Failed to fetch booking details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch booking details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
