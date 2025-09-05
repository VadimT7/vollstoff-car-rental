import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'
import { randomBytes } from 'crypto'

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Booking creation API called')
    
    // Test database connection first
    const dbConnected = await testDatabaseConnection()
    if (!dbConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }
    
    const {
      carId,
      startDate,
      endDate,
      pickupType = 'SHOWROOM',
      returnType = 'SHOWROOM',
      pickupLocation,
      returnLocation,
      deliveryAddress,
      guestEmail,
      guestName,
      guestPhone,
      customerNotes,
      paymentIntentId,
      totalAmount,
      basePriceTotal,
      addOnsTotal = 0,
      feesTotal = 0,
      taxTotal = 0,
      includedKm = 200,
    } = await request.json()

    console.log('📝 Creating booking with data:', {
      carId,
      startDate,
      endDate,
      guestEmail,
      guestName,
      totalAmount,
      paymentIntentId
    })

    // Validate required fields
    if (!carId || !startDate || !endDate || !guestEmail || !guestName || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate booking number
    const bookingNumber = `FLY-${Date.now()}`

    // Create booking in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // For guest bookings, we need to create a guest user first
      let userId: string;
      
      // Check if guest user already exists
      const existingGuest = await tx.user.findUnique({
        where: { email: guestEmail }
      });
      
      if (existingGuest) {
        userId = existingGuest.id;
      } else {
        // Create a guest user
        const guestUser = await tx.user.create({
          data: {
            email: guestEmail,
            name: guestName || 'Guest User',
            phone: guestPhone,
            role: 'CUSTOMER',
            status: 'ACTIVE',
          }
        });
        userId = guestUser.id;
      }

      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber,
          userId,
          guestEmail,
          guestName,
          guestPhone,
          carId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          pickupType: pickupType as 'SHOWROOM' | 'DELIVERY',
          returnType: returnType as 'SHOWROOM' | 'DELIVERY',
          pickupLocation,
          returnLocation,
          deliveryAddress,
          basePriceTotal: basePriceTotal || totalAmount,
          addOnsTotal,
          feesTotal,
          taxTotal,
          totalAmount,
          includedKm,
          customerNotes,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          confirmedAt: new Date(),
        },
        include: {
          car: true,
          user: true,
        },
      })

      // Create payment record
      await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          stripePaymentIntentId: paymentIntentId,
          amount: totalAmount,
          currency: 'CAD',
          type: 'RENTAL_FEE',
          method: 'CARD',
          status: 'SUCCEEDED',
          metadata: {
            bookingNumber: newBooking.bookingNumber,
            guestEmail,
            guestName,
          },
        },
      })

      // Create availability blocks for the booking period
      const dates = []
      const currentDate = new Date(startDate)
      const endDateObj = new Date(endDate)
      
      while (currentDate <= endDateObj) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Create or update availability blocks
      for (const date of dates) {
        await tx.availability.upsert({
          where: {
            carId_date: {
              carId,
              date,
            }
          },
          update: {
            isAvailable: false,
            reason: 'BOOKED',
          },
          create: {
            carId,
            date,
            isAvailable: false,
            reason: 'BOOKED',
          },
        })
      }

      return newBooking
    })

    console.log('✅ Booking created successfully:', booking.id)

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.totalAmount,
        startDate: booking.startDate,
        endDate: booking.endDate,
        car: booking.car,
      },
    })
  } catch (error) {
    console.error('❌ Booking creation failed:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    return NextResponse.json(
      { 
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
