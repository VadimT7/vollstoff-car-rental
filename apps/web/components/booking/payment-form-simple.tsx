'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Shield, Lock } from 'lucide-react'
import { Button } from '@valore/ui'

interface PaymentFormSimpleProps {
  amount: number
  onSubmit: (data: any) => void
  isProcessing?: boolean
}

export function PaymentFormSimple({ amount, onSubmit, isProcessing = false }: PaymentFormSimpleProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      cardNumber,
      expiryDate,
      cvv,
      name
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Shield className="h-4 w-4" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Lock className="h-4 w-4" />
          <span>SSL Encrypted</span>
        </div>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            Pay Now
            <span className="ml-2">€{amount.toFixed(2)}</span>
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

export default PaymentFormSimple