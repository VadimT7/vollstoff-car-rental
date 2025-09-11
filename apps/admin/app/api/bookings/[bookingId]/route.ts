import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    console.log('🚀 Admin booking details API called for:', params.bookingId)
    
    // Fetch booking with all related data
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
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
            address: true,
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            type: true,
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
      startTime: booking.startTime || '10:00 AM',
      endTime: booking.endTime || '10:00 AM',
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
        name: booking.user.name || booking.guestName,
        email: booking.user.email || booking.guestEmail,
        phone: booking.user.phone || booking.guestPhone,
        licenseNumber: booking.user.licenseNumber || booking.guestLicense,
        address: booking.user.address || null,
      } : {
        name: booking.guestName,
        email: booking.guestEmail,
        phone: booking.guestPhone,
        licenseNumber: booking.guestLicense,
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

    console.log(`✅ Booking ${params.bookingId} details fetched successfully`)

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
