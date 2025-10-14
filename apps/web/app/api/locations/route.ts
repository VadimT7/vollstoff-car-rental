import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll return static locations with proper addresses
    // In a production system, these would be stored in the database
    const locations = [
      {
        id: 'showroom',
        name: 'Top Tier Rental Showroom (Los Angeles)',
        address: 'Wilshire Boulevard, Los Angeles, CA',
        type: 'SHOWROOM',
        isDefault: true
      },
      {
        id: 'airport',
        name: 'Los Angeles International Airport (LAX)',
        address: 'Los Angeles International Airport, Los Angeles, CA',
        type: 'AIRPORT',
        isDefault: false
      },
      {
        id: 'hotel',
        name: 'Hotel Delivery',
        address: 'Your Hotel Address (Los Angeles Area)',
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
