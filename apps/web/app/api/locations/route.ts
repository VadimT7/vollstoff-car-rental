import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll return static locations with proper addresses
    // In a production system, these would be stored in the database
    const locations = [
      {
        id: 'showroom',
        name: 'FlyRentals Showroom (Montreal)',
        address: '1555 Rue Richelieu, Montreal, QC H3J 1G8',
        type: 'SHOWROOM',
        isDefault: true
      },
      {
        id: 'airport',
        name: 'Montreal Airport (YUL)',
        address: '975 Roméo-Vachon Blvd N, Dorval, QC H4Y 1H1',
        type: 'AIRPORT',
        isDefault: false
      },
      {
        id: 'hotel',
        name: 'Hotel Delivery',
        address: 'Your Hotel Address (Montreal Area)',
        type: 'HOTEL',
        isDefault: false
      }
    ]

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}
