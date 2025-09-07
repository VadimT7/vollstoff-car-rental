import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🚗 Fetching vehicles for admin dashboard...')
    
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Fetch vehicles with booking counts
    const vehicles = await prisma.car.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    })

    console.log(`✅ Found ${vehicles.length} vehicles`)

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('❌ Failed to fetch vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    const updatedVehicle = await prisma.car.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('❌ Failed to update vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}