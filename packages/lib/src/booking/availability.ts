import { prisma } from '@valore/database'
import { startOfDay, eachDayOfInterval, isBefore, isAfter, isEqual } from 'date-fns'

// Type imports - these will be available after Prisma generates
type Car = any

export interface AvailabilityCheckParams {
  carId: string
  startDate: Date
  endDate: Date
}

export interface AvailabilityResult {
  available: boolean
  reason?: string
  conflictingBookings?: Array<{
    id: string
    startDate: Date
    endDate: Date
  }>
  blockedDates?: Date[]
}

/**
 * Check if a car is available for the given date range
 */
export async function checkCarAvailability({
  carId,
  startDate,
  endDate,
}: AvailabilityCheckParams): Promise<AvailabilityResult> {
  // Normalize dates to start of day
  const checkStartDate = startOfDay(startDate)
  const checkEndDate = startOfDay(endDate)
  
  // Validate date range
  if (isBefore(checkEndDate, checkStartDate)) {
    return {
      available: false,
      reason: 'Invalid date range: end date is before start date',
    }
  }
  
  // Check if car exists and is active
  const car = await prisma.car.findUnique({
    where: { id: carId },
    select: { id: true, status: true },
  })
  
  if (!car) {
    return {
      available: false,
      reason: 'Car not found',
    }
  }
  
  if (car.status !== 'ACTIVE') {
    return {
      available: false,
      reason: `Car is currently ${car.status.toLowerCase()}`,
    }
  }
  
  // Check for conflicting bookings
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      carId,
      status: {
        in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING'],
      },
      OR: [
        {
          // Booking starts within our range
          startDate: {
            gte: checkStartDate,
            lte: checkEndDate,
          },
        },
        {
          // Booking ends within our range
          endDate: {
            gte: checkStartDate,
            lte: checkEndDate,
          },
        },
        {
          // Booking completely encompasses our range
          AND: [
            { startDate: { lte: checkStartDate } },
            { endDate: { gte: checkEndDate } },
          ],
        },
        {
          // Our range completely encompasses an existing booking
          AND: [
            { startDate: { gte: checkStartDate } },
            { endDate: { lte: checkEndDate } },
          ],
        },
      ],
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
    },
  })
  
  if (conflictingBookings.length > 0) {
    return {
      available: false,
      reason: 'Car is already booked for these dates',
      conflictingBookings,
    }
  }
  
  // Check availability blocks
  const dates = eachDayOfInterval({ start: checkStartDate, end: checkEndDate })
  
  const blockedAvailability = await prisma.availability.findMany({
    where: {
      carId,
      date: {
        in: dates,
      },
      isAvailable: false,
    },
    select: {
      date: true,
      reason: true,
    },
  })
  
  if (blockedAvailability.length > 0) {
    return {
      available: false,
      reason: 'Car is not available on some of the selected dates',
      blockedDates: blockedAvailability.map((a: any) => a.date),
    }
  }
  
  // All checks passed
  return {
    available: true,
  }
}

/**
 * Get availability calendar for a car
 */
export async function getCarAvailabilityCalendar(
  carId: string,
  startDate: Date,
  endDate: Date
): Promise<Map<string, boolean>> {
  const dates = eachDayOfInterval({ 
    start: startOfDay(startDate), 
    end: startOfDay(endDate) 
  })
  
  // Get all bookings in the range
  const bookings = await prisma.booking.findMany({
    where: {
      carId,
      status: {
        in: ['CONFIRMED', 'IN_PROGRESS'],
      },
      OR: [
        {
          startDate: {
            lte: endDate,
          },
          endDate: {
            gte: startDate,
          },
        },
      ],
    },
    select: {
      startDate: true,
      endDate: true,
    },
  })
  
  // Get all availability blocks
  const availabilityBlocks = await prisma.availability.findMany({
    where: {
      carId,
      date: {
        in: dates,
      },
      isAvailable: false,
    },
    select: {
      date: true,
    },
  })
  
  // Build availability map
  const availabilityMap = new Map<string, boolean>()
  
  for (const date of dates) {
    const dateStr = date.toISOString().split('T')[0]
    let isAvailable = true
    
    // Check if date is blocked
    if (availabilityBlocks.some((block: any) => 
      isEqual(startOfDay(block.date), date)
    )) {
      isAvailable = false
    }
    
    // Check if date falls within a booking
    for (const booking of bookings) {
      const bookingStart = startOfDay(booking.startDate)
      const bookingEnd = startOfDay(booking.endDate)
      
      if (!isBefore(date, bookingStart) && !isAfter(date, bookingEnd)) {
        isAvailable = false
        break
      }
    }
    
    availabilityMap.set(dateStr, isAvailable)
  }
  
  return availabilityMap
}

/**
 * Block car availability for maintenance or other reasons
 */
export async function blockCarAvailability(
  carId: string,
  dates: Date[],
  reason: string
): Promise<void> {
  const availabilityData = dates.map(date => ({
    carId,
    date: startOfDay(date),
    isAvailable: false,
    reason,
  }))
  
  await prisma.availability.createMany({
    data: availabilityData,
    skipDuplicates: true,
  })
}

/**
 * Unblock car availability
 */
export async function unblockCarAvailability(
  carId: string,
  dates: Date[]
): Promise<void> {
  await prisma.availability.deleteMany({
    where: {
      carId,
      date: {
        in: dates.map(d => startOfDay(d)),
      },
    },
  })
}

/**
 * Get available cars for a date range
 */
export async function getAvailableCars(
  startDate: Date,
  endDate: Date,
  options?: {
    category?: string
    minSeats?: number
    priceRange?: { min: number; max: number }
  }
): Promise<Car[]> {
  // Get all active cars
  const cars = await prisma.car.findMany({
    where: {
      status: 'ACTIVE',
      ...(options?.category && { category: options.category as any }),
      ...(options?.minSeats && { seats: { gte: options.minSeats } }),
    },
    include: {
      priceRules: {
        where: {
          isActive: true,
          validFrom: { lte: startDate },
          OR: [
            { validUntil: null },
            { validUntil: { gte: endDate } },
          ],
        },
        take: 1,
      },
    },
  })
  
  // Filter by availability
  const availableCars = []
  
  for (const car of cars) {
    // Apply price filter if specified
    if (options?.priceRange && car.priceRules[0]) {
      const pricePerDay = Number(car.priceRules[0].basePricePerDay)
      if (pricePerDay < options.priceRange.min || pricePerDay > options.priceRange.max) {
        continue
      }
    }
    
    const availability = await checkCarAvailability({
      carId: car.id,
      startDate,
      endDate,
    })
    
    if (availability.available) {
      availableCars.push(car)
    }
  }
  
  return availableCars
}
