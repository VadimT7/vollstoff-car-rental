import { prisma } from '@valore/database'
import { differenceInDays, isWeekend, startOfDay } from 'date-fns'
import Decimal from 'decimal.js'

// Type imports - these will be available after Prisma generates
type Coupon = any

export interface PricingParams {
  carId: string
  startDate: Date
  endDate: Date
  addOnIds?: string[]
  couponCode?: string
}

export interface PricingBreakdown {
  basePricePerDay: Decimal
  numberOfDays: number
  baseTotal: Decimal
  weekendDays: number
  weekendSurcharge: Decimal
  seasonalSurcharge: Decimal
  discounts: {
    lengthDiscount: Decimal
    couponDiscount: Decimal
  }
  addOns: Array<{
    id: string
    name: string
    quantity: number
    unitPrice: Decimal
    total: Decimal
  }>
  delivery: {
    pickupFee: Decimal
    returnFee: Decimal
  }
  subtotal: Decimal
  taxes: Decimal
  deposit: Decimal
  total: Decimal
  includedKilometers: number
  extraKilometerPrice: Decimal
}

/**
 * Calculate complete pricing for a booking
 */
export async function calculateBookingPrice(
  params: PricingParams
): Promise<PricingBreakdown> {
  const { carId, startDate, endDate, addOnIds = [], couponCode } = params
  
  // Normalize dates
  const start = startOfDay(startDate)
  const end = startOfDay(endDate)
  
  // Calculate number of days
  const numberOfDays = differenceInDays(end, start) + 1
  
  if (numberOfDays < 1) {
    throw new Error('Invalid date range')
  }
  
  // Get active price rule for the car
  const priceRule = await prisma.priceRule.findFirst({
    where: {
      carId,
      isActive: true,
      validFrom: { lte: start },
      OR: [
        { validUntil: null },
        { validUntil: { gte: end } },
      ],
    },
    include: {
      seasonalRates: {
        where: {
          startDate: { lte: end },
          endDate: { gte: start },
        },
      },
    },
  })
  
  if (!priceRule) {
    throw new Error('No active pricing found for this car')
  }
  
  // Validate booking duration
  if (numberOfDays < priceRule.minimumDays) {
    throw new Error(`Minimum rental period is ${priceRule.minimumDays} days`)
  }
  
  if (priceRule.maximumDays && numberOfDays > priceRule.maximumDays) {
    throw new Error(`Maximum rental period is ${priceRule.maximumDays} days`)
  }
  
  // Calculate base price
  const basePricePerDay = new Decimal(priceRule.basePricePerDay.toString())
  let baseTotal = basePricePerDay.times(numberOfDays)
  
  // Calculate weekend surcharge
  let weekendDays = 0
  const currentDate = new Date(start)
  while (currentDate <= end) {
    if (isWeekend(currentDate)) {
      weekendDays++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  const weekendMultiplier = new Decimal(priceRule.weekendMultiplier.toString())
  const weekendSurcharge = basePricePerDay
    .times(weekendMultiplier.minus(1))
    .times(weekendDays)
  
  // Calculate seasonal surcharge
  let seasonalSurcharge = new Decimal(0)
  for (const seasonalRate of priceRule.seasonalRates) {
    const overlapDays = calculateOverlapDays(
      start,
      end,
      seasonalRate.startDate,
      seasonalRate.endDate
    )
    
    if (overlapDays > 0) {
      const seasonalMultiplier = new Decimal(seasonalRate.multiplier.toString())
      seasonalSurcharge = seasonalSurcharge.plus(
        basePricePerDay
          .times(seasonalMultiplier.minus(1))
          .times(overlapDays)
      )
    }
  }
  
  // Apply length discounts
  let lengthDiscount = new Decimal(0)
  if (numberOfDays >= 7 && priceRule.weeklyDiscount) {
    lengthDiscount = baseTotal
      .times(priceRule.weeklyDiscount.toString())
      .dividedBy(100)
  } else if (numberOfDays >= 30 && priceRule.monthlyDiscount) {
    lengthDiscount = baseTotal
      .times(priceRule.monthlyDiscount.toString())
      .dividedBy(100)
  }
  
  // Calculate subtotal before add-ons and coupons
  let subtotal = baseTotal
    .plus(weekendSurcharge)
    .plus(seasonalSurcharge)
    .minus(lengthDiscount)
  
  // Process add-ons
  const addOnDetails = []
  if (addOnIds.length > 0) {
    const addOns = await prisma.addOn.findMany({
      where: {
        id: { in: addOnIds },
        isActive: true,
      },
    })
    
    for (const addOn of addOns) {
      const addOnPrice = new Decimal(addOn.price.toString())
      let total = addOnPrice
      
      if (addOn.priceType === 'PER_DAY') {
        total = addOnPrice.times(numberOfDays)
      }
      
      addOnDetails.push({
        id: addOn.id,
        name: addOn.name,
        quantity: 1, // TODO: Support multiple quantities
        unitPrice: addOnPrice,
        total,
      })
      
      subtotal = subtotal.plus(total)
    }
  }
  
  // Apply coupon discount
  let couponDiscount = new Decimal(0)
  if (couponCode) {
    const coupon = await validateAndGetCoupon(couponCode, subtotal)
    if (coupon) {
      if (coupon.discountType === 'PERCENTAGE') {
        couponDiscount = subtotal
          .times(coupon.discountValue.toString())
          .dividedBy(100)
      } else {
        couponDiscount = new Decimal(coupon.discountValue.toString())
      }
      
      // Apply maximum discount limit if set
      if (coupon.maximumDiscount) {
        const maxDiscount = new Decimal(coupon.maximumDiscount.toString())
        couponDiscount = Decimal.min(couponDiscount, maxDiscount)
      }
      
      subtotal = subtotal.minus(couponDiscount)
    }
  }
  
  // Calculate taxes (assuming 10% for now - should be configurable)
  const taxRate = new Decimal('0.10')
  const taxes = subtotal.times(taxRate)
  
  // Calculate total
  const total = subtotal.plus(taxes)
  
  // Get deposit amount
  const deposit = new Decimal(priceRule.depositAmount.toString())
  
  // Calculate included kilometers
  const includedKilometers = priceRule.includedKmPerDay * numberOfDays
  const extraKilometerPrice = new Decimal(priceRule.extraKmPrice.toString())
  
  return {
    basePricePerDay,
    numberOfDays,
    baseTotal,
    weekendDays,
    weekendSurcharge,
    seasonalSurcharge,
    discounts: {
      lengthDiscount,
      couponDiscount,
    },
    addOns: addOnDetails,
    delivery: {
      pickupFee: new Decimal(0), // TODO: Implement delivery pricing
      returnFee: new Decimal(0),
    },
    subtotal,
    taxes,
    deposit,
    total,
    includedKilometers,
    extraKilometerPrice,
  }
}

/**
 * Calculate overlap days between two date ranges
 */
function calculateOverlapDays(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): number {
  const overlapStart = start1 > start2 ? start1 : start2
  const overlapEnd = end1 < end2 ? end1 : end2
  
  if (overlapStart > overlapEnd) {
    return 0
  }
  
  return differenceInDays(overlapEnd, overlapStart) + 1
}

/**
 * Validate coupon and return if valid
 */
async function validateAndGetCoupon(
  code: string,
  subtotal: Decimal
): Promise<Coupon | null> {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
  })
  
  if (!coupon || !coupon.isActive) {
    return null
  }
  
  const now = new Date()
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return null
  }
  
  if (coupon.minimumAmount) {
    const minAmount = new Decimal(coupon.minimumAmount.toString())
    if (subtotal.lessThan(minAmount)) {
      return null
    }
  }
  
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return null
  }
  
  return coupon
}

/**
 * Format price breakdown for display
 */
export function formatPricingBreakdown(
  breakdown: PricingBreakdown,
  currency: string = 'EUR',
  locale: string = 'en-US'
): Record<string, string> {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  return {
    basePricePerDay: formatter.format(breakdown.basePricePerDay.toNumber()),
    baseTotal: formatter.format(breakdown.baseTotal.toNumber()),
    weekendSurcharge: formatter.format(breakdown.weekendSurcharge.toNumber()),
    seasonalSurcharge: formatter.format(breakdown.seasonalSurcharge.toNumber()),
    lengthDiscount: formatter.format(breakdown.discounts.lengthDiscount.toNumber()),
    couponDiscount: formatter.format(breakdown.discounts.couponDiscount.toNumber()),
    subtotal: formatter.format(breakdown.subtotal.toNumber()),
    taxes: formatter.format(breakdown.taxes.toNumber()),
    deposit: formatter.format(breakdown.deposit.toNumber()),
    total: formatter.format(breakdown.total.toNumber()),
  }
}
