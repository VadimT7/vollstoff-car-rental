import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '@valore/lib'
import { prisma } from '@valore/database'
import { TRPCError } from '@trpc/server'
import { checkCarAvailability, calculateBookingPrice, createPaymentIntent, createSecurityDepositHold, sendBookingConfirmation } from '@valore/lib'
import { randomBytes } from 'crypto'

const createBookingInput = z.object({
  carId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  pickupType: z.enum(['SHOWROOM', 'DELIVERY']),
  returnType: z.enum(['SHOWROOM', 'DELIVERY']),
  pickupLocation: z.string().optional(),
  returnLocation: z.string().optional(),
  deliveryAddress: z.string().optional(),
  addOnIds: z.array(z.string()).optional(),
  couponCode: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestLicense: z.string().optional(),
  customerNotes: z.string().optional(),
  paymentMethodId: z.string(),
  payWithCash: z.boolean().default(false),
})

export const bookingsRouter = router({
  // Calculate booking price
  calculatePrice: publicProcedure
    .input(
      z.object({
        carId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        addOnIds: z.array(z.string()).optional(),
        couponCode: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const pricing = await calculateBookingPrice({
        carId: input.carId,
        startDate: input.startDate,
        endDate: input.endDate,
        addOnIds: input.addOnIds,
        couponCode: input.couponCode,
      })
      
      return pricing
    }),

  // Create a new booking
  create: publicProcedure
    .input(createBookingInput)
    .mutation(async ({ input, ctx }) => {
      // Check availability first
      const availability = await checkCarAvailability({
        carId: input.carId,
        startDate: input.startDate,
        endDate: input.endDate,
      })
      
      if (!availability.available) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: availability.reason || 'Car is not available for selected dates',
        })
      }
      
      // Calculate pricing
      const pricing = await calculateBookingPrice({
        carId: input.carId,
        startDate: input.startDate,
        endDate: input.endDate,
        addOnIds: input.addOnIds,
        couponCode: input.couponCode,
      })
      
      // Generate booking number
      const bookingNumber = `VR${Date.now()}${randomBytes(2).toString('hex').toUpperCase()}`
      
      // Create booking in a transaction
      const booking = await prisma.$transaction(async (tx: any) => {
        // Create the booking
        // For guest bookings, we need to create a guest user first
        let userId = ctx.session?.user?.id;
        
        if (!userId && input.guestEmail) {
          // Check if guest user already exists
          const existingGuest = await tx.user.findUnique({
            where: { email: input.guestEmail }
          });
          
          if (existingGuest) {
            userId = existingGuest.id;
            // Update phone if provided
            if (input.guestPhone && !existingGuest.phone) {
              await tx.user.update({
                where: { id: existingGuest.id },
                data: { phone: input.guestPhone }
              });
            }
          } else {
            // Create a guest user with all provided details
            const guestUser = await tx.user.create({
              data: {
                email: input.guestEmail,
                name: input.guestName || 'Guest User',
                phone: input.guestPhone || null,
                role: 'CUSTOMER',
                status: 'ACTIVE',
              }
            });
            userId = guestUser.id;
          }
        }
        
        if (!userId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User ID or guest email is required for booking'
          });
        }
        
        const newBooking = await tx.booking.create({
          data: {
            bookingNumber,
            userId,
            guestEmail: input.guestEmail,
            guestName: input.guestName,
            guestPhone: input.guestPhone,
            guestLicense: input.guestLicense,
            carId: input.carId,
            startDate: input.startDate,
            endDate: input.endDate,
            pickupType: input.pickupType,
            returnType: input.returnType,
            pickupLocation: input.pickupLocation,
            returnLocation: input.returnLocation,
            deliveryAddress: input.deliveryAddress,
            basePriceTotal: pricing.subtotal.toNumber(),
            addOnsTotal: pricing.addOns.reduce((sum, addon) => sum + addon.total.toNumber(), 0),
            feesTotal: pricing.delivery.pickupFee.plus(pricing.delivery.returnFee).toNumber(),
            taxTotal: pricing.taxes.toNumber(),
            totalAmount: pricing.total.toNumber(),
            includedKm: pricing.includedKilometers,
            customerNotes: input.customerNotes,
            status: 'CONFIRMED', // Auto-confirm for now
            paymentStatus: 'PAID', // Mark as paid for now
            confirmedAt: new Date(),
          },
          include: {
            car: true,
            user: true,
          },
        })
        
        // Create add-on associations
        if (input.addOnIds && input.addOnIds.length > 0) {
          const addOnData = pricing.addOns.map(addon => ({
            bookingId: newBooking.id,
            addOnId: addon.id,
            quantity: addon.quantity,
            unitPrice: addon.unitPrice.toNumber(),
            totalPrice: addon.total.toNumber(),
          }))
          
          await tx.bookingAddOn.createMany({
            data: addOnData,
          })
        }
        
        // Create availability blocks for the booking period
        const dates = []
        const currentDate = new Date(input.startDate)
        while (currentDate <= input.endDate) {
          dates.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + 1)
        }
        
        await tx.availability.createMany({
          data: dates.map(date => ({
            carId: input.carId,
            date,
            isAvailable: false,
            reason: `Booked - ${bookingNumber}`,
          })),
          skipDuplicates: true,
        })
        
        // Update coupon usage if applicable
        if (input.couponCode) {
          await tx.coupon.update({
            where: { code: input.couponCode },
            data: { usageCount: { increment: 1 } },
          })
        }
        
        return newBooking
      })
      
      // For now, skip payment processing and just return the booking
      // TODO: Implement proper payment flow with Stripe
      console.log('Booking created:', booking.id, 'Payment processing skipped for demo')
      
      return booking
    }),

  // Get user's bookings
  getUserBookings: protectedProcedure
    .input(
      z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const bookings = await prisma.booking.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.status && { status: input.status }),
        },
        include: {
          car: {
            include: {
              images: {
                take: 1,
                orderBy: { order: 'asc' },
              },
            },
          },
          addOns: {
            include: {
              addOn: true,
            },
          },
          payments: {
            where: {
              status: 'SUCCEEDED',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      })
      
      let nextCursor: typeof input.cursor | undefined = undefined
      if (bookings.length > input.limit) {
        const nextItem = bookings.pop()
        nextCursor = nextItem!.id
      }
      
      return {
        bookings,
        nextCursor,
      }
    }),

  // Get booking by ID
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const booking = await prisma.booking.findUnique({
        where: { id: input },
        include: {
          car: {
            include: {
              images: true,
              priceRules: {
                where: { isActive: true },
                take: 1,
              },
            },
          },
          user: true,
          addOns: {
            include: {
              addOn: true,
            },
          },
          payments: true,
          contract: true,
        },
      })
      
      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        })
      }
      
      // Check if user has access to this booking
      if (ctx.session?.user?.id !== booking.userId && !booking.guestEmail) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have access to this booking',
        })
      }
      
      return booking
    }),

  // Cancel booking
  cancel: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          payments: {
            where: {
              type: { in: ['RENTAL_FEE', 'DEPOSIT'] },
              status: 'SUCCEEDED',
            },
          },
        },
      })
      
      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        })
      }
      
      if (booking.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only cancel your own bookings',
        })
      }
      
      if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This booking cannot be cancelled',
        })
      }
      
      // Calculate cancellation fee based on policy
      const hoursUntilPickup = (booking.startDate.getTime() - Date.now()) / (1000 * 60 * 60)
      let cancellationFee = 0
      
      if (hoursUntilPickup < 24) {
        cancellationFee = Number(booking.totalAmount) * 0.5 // 50% fee
      } else if (hoursUntilPickup < 48) {
        cancellationFee = Number(booking.totalAmount) * 0.25 // 25% fee
      }
      
      // Update booking status
      const cancelledBooking = await prisma.booking.update({
        where: { id: input.bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          internalNotes: input.reason,
        },
      })
      
      // Remove availability blocks
      await prisma.availability.deleteMany({
        where: {
          carId: booking.carId,
          date: {
            gte: booking.startDate,
            lte: booking.endDate,
          },
          reason: { contains: booking.bookingNumber },
        },
      })
      
      // TODO: Process refunds via Stripe
      
      return {
        booking: cancelledBooking,
        cancellationFee,
        refundAmount: Number(booking.totalAmount) - cancellationFee,
      }
    }),
})
