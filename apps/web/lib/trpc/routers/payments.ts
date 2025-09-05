import { z } from 'zod'
import { router, protectedProcedure } from '@valore/lib'
import { prisma } from '@valore/database'
import { 
  createSetupIntent, 
  attachPaymentMethod, 
  listPaymentMethods,
  setDefaultPaymentMethod 
} from '@valore/lib'

export const paymentsRouter = router({
  // Create setup intent for saving payment methods
  createSetupIntent: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Get or create Stripe customer ID
      const user = await prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // TODO: Store stripeCustomerId in User model
      const customerId = 'cus_xxx' // This would come from user.stripeCustomerId
      
      const setupIntent = await createSetupIntent(customerId)
      
      return {
        clientSecret: setupIntent.client_secret,
      }
    }),

  // Save payment method
  savePaymentMethod: protectedProcedure
    .input(
      z.object({
        paymentMethodId: z.string(),
        setAsDefault: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // TODO: Get stripeCustomerId from user
      const customerId = 'cus_xxx'
      
      // Attach payment method to customer
      const paymentMethod = await attachPaymentMethod(
        input.paymentMethodId,
        customerId
      )
      
      // Save to database
      await prisma.paymentMethod.create({
        data: {
          userId: ctx.session.user.id,
          stripePaymentMethodId: paymentMethod.id,
          type: paymentMethod.type,
          card: paymentMethod.card as any,
          isDefault: input.setAsDefault,
        },
      })
      
      // Set as default if requested
      if (input.setAsDefault) {
        await setDefaultPaymentMethod(customerId, paymentMethod.id)
        
        // Update other payment methods to not be default
        await prisma.paymentMethod.updateMany({
          where: {
            userId: ctx.session.user.id,
            stripePaymentMethodId: { not: paymentMethod.id },
          },
          data: { isDefault: false },
        })
      }
      
      return paymentMethod
    }),

  // Get saved payment methods
  getPaymentMethods: protectedProcedure
    .query(async ({ ctx }) => {
      return prisma.paymentMethod.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' },
        ],
      })
    }),

  // Delete payment method
  deletePaymentMethod: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      })
      
      if (!paymentMethod) {
        throw new Error('Payment method not found')
      }
      
      // TODO: Detach from Stripe
      
      await prisma.paymentMethod.delete({
        where: { id: input },
      })
      
      return { success: true }
    }),

  // Get payment history
  getPaymentHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const payments = await prisma.payment.findMany({
        where: {
          booking: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          booking: {
            include: {
              car: true,
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
      if (payments.length > input.limit) {
        const nextItem = payments.pop()
        nextCursor = nextItem!.id
      }
      
      return {
        payments,
        nextCursor,
      }
    }),
})
