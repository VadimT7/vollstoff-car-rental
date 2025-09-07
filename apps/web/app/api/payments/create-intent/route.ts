import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@valore/database'

// Initialize Stripe with error handling
let stripe: Stripe | null = null
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set')
  }
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY does not start with sk_')
  }
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  })
  console.log('✅ Stripe initialized successfully')
} catch (error) {
  console.error('❌ Stripe initialization failed:', error)
}

export async function POST(request: NextRequest) {
  try {
    const { 
      amount, 
      currency = 'cad', 
      bookingId, 
      customerEmail,
      metadata = {}
    } = await request.json()

    if (!amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('💳 Creating real Stripe payment intent')
    console.log('🔑 Stripe Secret Key exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('🔑 Stripe Secret Key starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'))
    
    if (!stripe) {
      console.error('❌ Stripe is not initialized')
      return NextResponse.json(
        { error: 'Payment service not available' },
        { status: 500 }
      )
    }
    
    // Check if customer exists in Stripe
    let customer
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    })

    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          source: 'web_booking',
          ...metadata
        }
      })
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: bookingId || `BOOK-${Date.now()}`,
        customerEmail,
        ...metadata
      },
      description: `Car rental booking ${bookingId || ''}`,
    })

    // Store payment intent in database if bookingId exists
    if (bookingId && bookingId !== 'undefined') {
      try {
        await prisma.payment.create({
          data: {
            bookingId,
            stripePaymentIntentId: paymentIntent.id,
            amount: amount,
            currency: currency.toUpperCase(),
            type: 'RENTAL_FEE',
            method: 'CARD',
            status: 'PENDING',
            metadata: paymentIntent as any,
          },
        })
      } catch (dbError) {
        console.log('Database save skipped:', dbError)
        // Continue even if database save fails
      }
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
    })
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Payment intent creation failed' },
      { status: 500 }
    )
  }
}
