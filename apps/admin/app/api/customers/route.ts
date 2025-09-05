import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    console.log('👥 Fetching customers for admin dashboard...')

    // Fetch customers with their booking count
    const customers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        bookings: {
          select: {
            id: true,
            bookingNumber: true,
            status: true,
            totalAmount: true,
            startDate: true,
            endDate: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Latest 5 bookings per customer
        },
        _count: {
          select: {
            bookings: true,
          }
        }
      },
    })

    // Transform the data to match the expected format
    const transformedCustomers = customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      totalBookings: customer._count.bookings,
      totalSpent: customer.bookings.reduce((sum, booking) => sum + parseFloat(booking.totalAmount), 0),
      recentBookings: customer.bookings,
    }))

    console.log(`✅ Found ${transformedCustomers.length} customers`)

    return NextResponse.json(transformedCustomers)
  } catch (error) {
    console.error('❌ Failed to fetch customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

