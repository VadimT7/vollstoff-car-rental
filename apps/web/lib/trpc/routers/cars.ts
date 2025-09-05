import { z } from 'zod'
import { router, publicProcedure } from '@valore/lib'
import { prisma } from '@valore/database'
import { TRPCError } from '@trpc/server'
import { getAvailableCars, getCarAvailabilityCalendar } from '@valore/lib'

export const carsRouter = router({
  // Get all cars with optional filters
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        available: z.boolean().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const where: any = {}
      
      if (input?.category) {
        where.category = input.category
      }
      
      if (input?.featured !== undefined) {
        where.featured = input.featured
      }
      
      // If checking availability, use the availability service
      if (input?.available && input?.startDate && input?.endDate) {
        return getAvailableCars(input.startDate, input.endDate, {
          category: input.category,
          priceRange: input.minPrice || input.maxPrice ? {
            min: input.minPrice || 0,
            max: input.maxPrice || 999999,
          } : undefined,
        })
      }
      
      // Otherwise, just get all cars with basic filters
      const cars = await prisma.car.findMany({
        where: {
          ...where,
          status: 'ACTIVE',
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          priceRules: {
            where: {
              isActive: true,
              OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } },
              ],
            },
            orderBy: { validFrom: 'desc' },
            take: 1,
          },
        },
        orderBy: [
          { featured: 'desc' },
          { featuredOrder: 'asc' },
          { createdAt: 'desc' },
        ],
      })
      
      // Filter by price if specified
      if (input?.minPrice || input?.maxPrice) {
        return cars.filter((car: any) => {
          const priceRule = car.priceRules[0]
          if (!priceRule) return false
          
          const price = Number(priceRule.basePricePerDay)
          if (input.minPrice && price < input.minPrice) return false
          if (input.maxPrice && price > input.maxPrice) return false
          
          return true
        })
      }
      
      return cars
    }),

  // Get a single car by ID or slug
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.id && !input.slug) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either id or slug must be provided',
        })
      }
      
      const car = await prisma.car.findFirst({
        where: {
          OR: [
            { id: input.id },
            { slug: input.slug },
          ].filter(Boolean),
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          priceRules: {
            where: {
              isActive: true,
              OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } },
              ],
            },
            include: {
              seasonalRates: {
                where: {
                  endDate: { gte: new Date() },
                },
              },
            },
            orderBy: { validFrom: 'desc' },
            take: 1,
          },
        },
      })
      
      if (!car) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Car not found',
        })
      }
      
      return car
    }),

  // Get availability calendar for a car
  getAvailability: publicProcedure
    .input(
      z.object({
        carId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      const calendar = await getCarAvailabilityCalendar(
        input.carId,
        input.startDate,
        input.endDate
      )
      
      // Convert Map to object for JSON serialization
      const availability: Record<string, boolean> = {}
      calendar.forEach((value, key) => {
        availability[key] = value
      })
      
      return availability
    }),

  // Get featured cars
  getFeatured: publicProcedure
    .query(async () => {
      return prisma.car.findMany({
        where: {
          featured: true,
          status: 'ACTIVE',
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          priceRules: {
            where: {
              isActive: true,
              OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } },
              ],
            },
            orderBy: { validFrom: 'desc' },
            take: 1,
          },
        },
        orderBy: [
          { featuredOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        take: 6,
      })
    }),

  // Get similar cars
  getSimilar: publicProcedure
    .input(
      z.object({
        carId: z.string(),
        take: z.number().optional().default(3),
      })
    )
    .query(async ({ input }) => {
      const car = await prisma.car.findUnique({
        where: { id: input.carId },
        select: { category: true, id: true },
      })
      
      if (!car) {
        return []
      }
      
      return prisma.car.findMany({
        where: {
          category: car.category,
          status: 'ACTIVE',
          id: { not: car.id },
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          priceRules: {
            where: {
              isActive: true,
              OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } },
              ],
            },
            orderBy: { validFrom: 'desc' },
            take: 1,
          },
        },
        take: input.take,
      })
    }),
})
