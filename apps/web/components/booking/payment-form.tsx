'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Shield, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Button, Card } from '@valore/ui'
import { formatCurrency } from '@valore/ui'

// Initialize Stripe (only if we have real keys)
const hasRealStripeKeys = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_key_here') &&
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')

const stripePromise = hasRealStripeKeys ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!) : null

interface PaymentFormProps {
  amount: number
  bookingData: any
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

// Mock payment form component (no Stripe hooks)
function MockCheckoutForm({ amount, bookingData, onSuccess, onError }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  // Payment method is always card

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setMessage(null)

    try {
      console.log('🔧 Simulating mock payment success')
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      onSuccess(`mock_payment_${Date.now()}`)
    } catch (err) {
      setMessage('An unexpected error occurred.')
      onError('Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-neutral-700">Payment Method</label>
        <div className="max-w-sm">
          <div className="p-4 rounded-lg border-2 border-amber-500 bg-amber-50">
            <CreditCard className="h-6 w-6 mx-auto mb-2 text-neutral-700" />
            <p className="text-sm font-medium text-center">Credit/Debit Card</p>
            <p className="text-xs text-neutral-500 mt-1 text-center">Secure online payment</p>
          </div>
        </div>
      </div>

      {/* Mock Payment Element */}
      {(
        <div className="space-y-4">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Demo Payment Mode</p>
                <p className="text-sm text-blue-700">No real Stripe keys configured</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium text-neutral-700">Card Number</p>
                <p className="text-sm text-neutral-500">4242 4242 4242 4242 (Demo)</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm font-medium text-neutral-700">Expiry</p>
                  <p className="text-sm text-neutral-500">12/25</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm font-medium text-neutral-700">CVC</p>
                  <p className="text-sm text-neutral-500">123</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-3">
              💡 This is a demo payment. In production, real Stripe keys would be used.
            </p>
          </Card>
        </div>
      )}


      {/* Error Message */}
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{message}</p>
          </div>
        </div>
      )}

      {/* Security Features */}
      <div className="flex items-center justify-center gap-6 py-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Lock className="h-4 w-4" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Shield className="h-4 w-4" />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <CheckCircle className="h-4 w-4" />
          <span>Verified by Stripe</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            Pay Now
            <span className="ml-2">${amount.toFixed(2)}</span>
          </>
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-neutral-500 text-center">
        By completing this booking, you agree to our{' '}
        <a href="/terms" className="text-amber-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a>
      </p>
    </form>
  )
}

// Real Stripe checkout form component
function StripeCheckoutForm({ amount, bookingData, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  // Payment method is always card

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsProcessing(true)
    setMessage(null)

    try {
      // If no real Stripe keys, simulate a successful payment
      if (!hasRealStripeKeys || !stripe || !elements) {
        console.log('🔧 Simulating mock payment success')
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        onSuccess(`mock_payment_${Date.now()}`)
        return
      }

      // Real Stripe payment processing
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
          receipt_email: bookingData.driverEmail,
        },
        redirect: 'if_required',
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'Payment failed')
        } else {
          setMessage('An unexpected error occurred.')
        }
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      }
    } catch (err) {
      setMessage('An unexpected error occurred.')
      onError('Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-neutral-700">Payment Method</label>
        <div className="max-w-sm">
          <div className="p-4 rounded-lg border-2 border-amber-500 bg-amber-50">
            <CreditCard className="h-6 w-6 mx-auto mb-2 text-neutral-700" />
            <p className="text-sm font-medium text-center">Credit/Debit Card</p>
            <p className="text-xs text-neutral-500 mt-1 text-center">Secure online payment</p>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      {(
        <div className="space-y-4">
          {hasRealStripeKeys ? (
            <PaymentElement 
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    email: 'auto',
                    phone: 'auto',
                    address: {
                      country: 'auto',
                    }
                  }
                }
              }}
            />
          ) : (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Demo Payment Mode</p>
                  <p className="text-sm text-blue-700">No real Stripe keys configured</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm font-medium text-neutral-700">Card Number</p>
                  <p className="text-sm text-neutral-500">4242 4242 4242 4242 (Demo)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="text-sm font-medium text-neutral-700">Expiry</p>
                    <p className="text-sm text-neutral-500">12/25</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="text-sm font-medium text-neutral-700">CVC</p>
                    <p className="text-sm text-neutral-500">123</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                💡 This is a demo payment. In production, real Stripe keys would be used.
              </p>
            </Card>
          )}
        </div>
      )}


      {/* Error Message */}
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{message}</p>
          </div>
        </div>
      )}

      {/* Security Features */}
      <div className="flex items-center justify-center gap-6 py-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Lock className="h-4 w-4" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Shield className="h-4 w-4" />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <CheckCircle className="h-4 w-4" />
          <span>Verified by Stripe</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            Pay Now
            <span className="ml-2">${amount.toFixed(2)}</span>
          </>
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-neutral-500 text-center">
        By completing this booking, you agree to our{' '}
        <a href="/terms" className="text-amber-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a>
      </p>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [isMockPayment, setIsMockPayment] = useState(false)

  useEffect(() => {
    // Create payment intent
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: props.amount,
        bookingId: `BOOK-${Date.now()}`,
        customerEmail: props.bookingData.driverEmail,
        metadata: {
          carSlug: props.bookingData.carSlug,
          startDate: props.bookingData.startDate,
          endDate: props.bookingData.endDate,
          customerName: props.bookingData.driverName,
        }
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
        setIsMockPayment(data.isMock || false)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to create payment intent:', err)
        props.onError('Failed to initialize payment')
        setLoading(false)
      })
  }, [props.amount])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <p className="font-medium text-neutral-900">Payment initialization failed</p>
            <p className="text-sm text-neutral-600 mt-1">Please try again or contact support</p>
          </div>
        </div>
      </Card>
    )
  }

  // If mock payment or no Stripe keys, render mock form directly
  if (isMockPayment || !hasRealStripeKeys) {
    return <MockCheckoutForm {...props} />
  }

  // Real Stripe integration
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#f59e0b',
      colorBackground: '#ffffff',
      colorText: '#171717',
      colorDanger: '#dc2626',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <StripeCheckoutForm {...props} />
    </Elements>
  )
}

