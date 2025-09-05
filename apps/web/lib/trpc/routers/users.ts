import { z } from 'zod'
import { router, protectedProcedure } from '@valore/lib'
import { prisma } from '@valore/database'

export const usersRouter = router({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        dateOfBirth: true,
        licenseNumber: true,
        licenseExpiry: true,
        licenseVerified: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        isVerified: true,
        createdAt: true,
      },
    })
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        dateOfBirth: z.date().optional(),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      })
    }),

  // Upload license
  uploadLicense: protectedProcedure
    .input(
      z.object({
        licenseNumber: z.string(),
        licenseExpiry: z.date(),
        licenseImageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          licenseNumber: input.licenseNumber,
          licenseExpiry: input.licenseExpiry,
          licenseImageUrl: input.licenseImageUrl,
          licenseVerified: false, // Will be verified by admin
        },
      })
    }),
})
