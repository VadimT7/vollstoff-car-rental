import Stripe from 'stripe'
import { prisma } from '@valore/database'
import Decimal from 'decimal.js'

// Type imports - these will be available after Prisma generates
type User = any

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export interface CreatePaymentIntentParams {
  bookingId: string
  amount: Decimal
  currency?: string
  customerId?: string
  paymentMethodId?: string
  capture?: boolean
  metadata?: Record<string, string>
}

export interface CreateHoldParams {
  bookingId: string
  amount: Decimal
  currency?: string
  customerId?: string
  paymentMethodId?: string
  metadata?: Record<string, string>
}

/**
 * Create a Stripe customer for a user
 */
export async function createStripeCustomer(user: User): Promise<string> {
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    phone: user.phone || undefined,
    metadata: {
      userId: user.id,
    },
  })
  
  // Store customer ID in database
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      // TODO: Add stripeCustomerId field to User model
      // For now, we'll store it in metadata
    },
  })
  
  return customer.id
}

/**
 * Create a payment intent for a booking
 */
export async function createPaymentIntent({
  bookingId,
  amount,
  currency = 'eur',
  customerId,
  paymentMethodId,
  capture = true,
  metadata = {},
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true },
  })
  
  if (!booking) {
    throw new Error('Booking not found')
  }
  
  // Create or get Stripe customer
  let stripeCustomerId = customerId
  if (!stripeCustomerId && booking.user) {
    // For now, create a new customer each time
    // TODO: Add stripeCustomerId field to User model
    stripeCustomerId = await createStripeCustomer(booking.user)
  }
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount.times(100).toNumber(), // Convert to cents
    currency,
    customer: stripeCustomerId,
    payment_method: paymentMethodId,
    capture_method: capture ? 'automatic' : 'manual',
    metadata: {
      bookingId,
      bookingNumber: booking.bookingNumber,
      ...metadata,
    },
    description: `Booking ${booking.bookingNumber}`,
  })
  
  // Store payment intent in database
  await prisma.payment.create({
    data: {
      bookingId,
      stripePaymentIntentId: paymentIntent.id,
      amount: amount.toNumber(),
      currency,
      type: 'RENTAL_FEE',
      method: 'CARD',
      status: 'PROCESSING',
      metadata: paymentIntent as any,
    },
  })
  
  return paymentIntent
}

/**
 * Create a security deposit hold
 */
export async function createSecurityDepositHold({
  bookingId,
  amount,
  currency = 'eur',
  customerId,
  paymentMethodId,
  metadata = {},
}: CreateHoldParams): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await createPaymentIntent({
    bookingId,
    amount,
    currency,
    customerId,
    paymentMethodId,
    capture: false, // Don't capture immediately for holds
    metadata: {
      type: 'security_deposit',
      ...metadata,
    },
  })
  
  // Update payment type to deposit
  await prisma.payment.updateMany({
    where: { 
      bookingId,
      stripePaymentIntentId: paymentIntent.id,
    },
    data: { type: 'DEPOSIT' },
  })
  
  return paymentIntent
}

/**
 * Capture a payment intent (for holds)
 */
export async function capturePaymentIntent(
  paymentIntentId: string,
  amountToCapture?: number
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.capture(
    paymentIntentId,
    amountToCapture ? { amount_to_capture: amountToCapture } : undefined
  )
  
  // Update payment status
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { 
      status: 'SUCCEEDED',
      processedAt: new Date(),
    },
  })
  
  return paymentIntent
}

/**
 * Cancel a payment intent (release hold)
 */
export async function cancelPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId)
  
  // Update payment status
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { 
      status: 'CANCELLED',
    },
  })
  
  return paymentIntent
}

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
): Promise<Stripe.Refund> {
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
  })
  
  if (!payment) {
    throw new Error('Payment not found')
  }
  
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? amount * 100 : undefined, // Convert to cents
    reason: reason as Stripe.RefundCreateParams.Reason,
    metadata: {
      bookingId: payment.bookingId,
    },
  })
  
  // Create refund payment record
  await prisma.payment.create({
    data: {
      bookingId: payment.bookingId,
      stripePaymentIntentId: paymentIntentId,
      stripeRefundId: refund.id,
      amount: -(amount || payment.amount), // Negative amount for refund
      currency: payment.currency,
      type: 'REFUND',
      method: payment.method,
      status: 'SUCCEEDED',
      processedAt: new Date(),
      metadata: refund as any,
    },
  })
  
  return refund
}

/**
 * Add a payment method to a customer
 */
export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
): Promise<Stripe.PaymentMethod> {
  const paymentMethod = await stripe.paymentMethods.attach(
    paymentMethodId,
    { customer: customerId }
  )
  
  return paymentMethod
}

/**
 * Set a default payment method for a customer
 */
export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<void> {
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

/**
 * List customer's payment methods
 */
export async function listPaymentMethods(
  customerId: string,
  type: Stripe.PaymentMethodListParams.Type = 'card'
): Promise<Stripe.PaymentMethod[]> {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type,
  })
  
  return paymentMethods.data
}

/**
 * Create a setup intent for saving payment methods
 */
export async function createSetupIntent(
  customerId: string,
  metadata?: Record<string, string>
): Promise<Stripe.SetupIntent> {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    metadata,
  })
  
  return setupIntent
}

/**
 * Handle webhook events from Stripe
 */
export async function handleStripeWebhook(
  payload: string | Buffer,
  signature: string
): Promise<void> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_key_for_build'
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`)
  }
  
  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
      break
      
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
      break
      
    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge)
      break
      
    case 'customer.created':
      await handleCustomerCreated(event.data.object as Stripe.Customer)
      break
      
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

// Webhook handlers
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { 
      status: 'SUCCEEDED',
      processedAt: new Date(),
      stripeChargeId: paymentIntent.latest_charge as string,
    },
  })
  
  // Update booking payment status
  const bookingId = paymentIntent.metadata.bookingId
  if (bookingId) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: 'PAID' },
    })
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { 
      status: 'FAILED',
      failureReason: paymentIntent.last_payment_error?.message,
    },
  })
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  // Update refund status if needed
  console.log('Charge refunded:', charge.id)
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  // Sync customer data if needed
  console.log('Customer created:', customer.id)
}
