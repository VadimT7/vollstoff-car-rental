import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Admin bookings API called')
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    console.log('📋 Fetching bookings for admin dashboard...')

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Fetch bookings with related data
    const bookings = await prisma.booking.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        car: {
          select: {
            id: true,
            displayName: true,
            make: true,
            model: true,
            year: true,
            primaryImageUrl: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        payments: {
          where: {
            type: 'RENTAL_FEE',
          },
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          }
        },
      },
    })

    // Transform the data to match the expected format
    const transformedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
      basePriceTotal: booking.basePriceTotal,
      addOnsTotal: booking.addOnsTotal,
      feesTotal: booking.feesTotal,
      taxTotal: booking.taxTotal,
      includedKm: booking.includedKm,
      customerNotes: booking.customerNotes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      // Customer info (from user or guest fields)
      customer: booking.user ? {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      } : {
        name: booking.guestName,
        email: booking.guestEmail,
        phone: booking.guestPhone,
      },
      // Car info
      car: booking.car,
      // Payment info
      payments: booking.payments,
    }))

    console.log(`✅ Found ${transformedBookings.length} bookings`)

    return NextResponse.json(transformedBookings)
  } catch (error) {
    console.error('❌ Failed to fetch bookings:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: 'Failed to fetch bookings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 Admin booking update API called')
    
    const { bookingId, status } = await request.json()

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing bookingId or status' },
        { status: 400 }
      )
    }

    console.log(`📝 Updating booking ${bookingId} to status: ${status}`)

    // Update the booking status in the database
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: status as any,
        updatedAt: new Date()
      },
      include: {
        car: {
          select: {
            id: true,
            displayName: true,
            make: true,
            model: true,
            year: true,
            primaryImageUrl: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        payments: {
          where: {
            type: 'RENTAL_FEE',
          },
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          }
        },
      },
    })

    console.log(`✅ Booking ${bookingId} updated successfully to ${status}`)

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        bookingNumber: updatedBooking.bookingNumber,
        status: updatedBooking.status,
        updatedAt: updatedBooking.updatedAt,
      }
    })
  } catch (error) {
    console.error('❌ Failed to update booking:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}