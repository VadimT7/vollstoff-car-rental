import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    console.log('💳 Fetching payments for admin dashboard...')

    // Fetch payments with booking and customer information
    const payments = await prisma.payment.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    })

    // Transform the data to match the expected format
    const transformedPayments = payments.map((payment: any) => ({
      id: payment.id,
      bookingNumber: payment.booking?.bookingNumber || 'N/A',
      customerName: payment.booking?.user?.name || 'Unknown',
      amount: parseFloat(String(payment.amount)),
      currency: payment.currency,
      type: payment.type, // Keep original type from DB
      method: payment.method as 'CARD' | 'CASH' | 'BANK_TRANSFER',
      status: payment.status as 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED',
      stripePaymentIntentId: payment.stripePaymentIntentId,
      createdAt: payment.createdAt,
      processedAt: payment.processedAt,
    }))

    console.log(`✅ Found ${transformedPayments.length} payments`)

    return NextResponse.json(transformedPayments)
  } catch (error) {
    console.error('❌ Failed to fetch payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
