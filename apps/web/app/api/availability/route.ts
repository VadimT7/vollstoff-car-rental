import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const carId = searchParams.get('carId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      )
    }

    // Get date range (default to next 90 days)
    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

    // Fetch all bookings for this car in the date range
    const bookings = await prisma.booking.findMany({
      where: {
        carId,
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING']
        },
        OR: [
          {
            startDate: {
              gte: start,
              lte: end
            }
          },
          {
            endDate: {
              gte: start,
              lte: end
            }
          },
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: end } }
            ]
          }
        ]
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true
      }
    })

    // Also fetch availability blocks
    const availabilityBlocks = await prisma.availability.findMany({
      where: {
        carId,
        date: {
          gte: start,
          lte: end
        },
        isAvailable: false
      },
      select: {
        date: true,
        reason: true
      }
    })

    // Create a map of blocked dates
    const blockedDates: Record<string, { booked: boolean, reason?: string }> = {}

    // Add dates from bookings
    bookings.forEach(booking => {
      const currentDate = new Date(booking.startDate)
      const endDate = new Date(booking.endDate)
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0]
        blockedDates[dateStr] = { booked: true, reason: 'Booked' }
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    // Add dates from availability blocks
    availabilityBlocks.forEach(block => {
      const dateStr = block.date.toISOString().split('T')[0]
      if (!blockedDates[dateStr]) {
        blockedDates[dateStr] = { booked: false, reason: block.reason || 'Blocked' }
      }
    })

    return NextResponse.json({
      carId,
      blockedDates,
      bookings: bookings.length
    })
  } catch (error) {
    console.error('Failed to fetch availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
