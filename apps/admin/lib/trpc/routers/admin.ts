import { z } from 'zod'
import { router, protectedProcedure } from '@valore/lib'
import { prisma } from '@valore/database'
import { TRPCError } from '@trpc/server'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

// Admin-only procedure that checks for admin role
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if ((ctx.session.user as any).role !== 'ADMIN' && (ctx.session.user as any).role !== 'SUPER_ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    })
  }
  return next()
})

export const adminRouter = router({
  // Get dashboard stats
  getDashboardStats: adminProcedure.query(async () => {
    const now = new Date()
    const startOfThisMonth = startOfMonth(now)
    const endOfThisMonth = endOfMonth(now)
    const startOfLastMonth = startOfMonth(subMonths(now, 1))
    const endOfLastMonth = endOfMonth(subMonths(now, 1))

    // Get revenue stats
    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    // Get active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS'],
        },
      },
    })

    // Get fleet utilization
    const totalCars = await prisma.car.count({
      where: { status: 'ACTIVE' },
    })

    const carsInUse = await prisma.booking.count({
      where: {
        status: 'IN_PROGRESS',
        startDate: { lte: now },
        endDate: { gte: now },
      },
    })

    const utilization = totalCars > 0 ? (carsInUse / totalCars) * 100 : 0

    // Calculate revenue change
    const currentRevenue = Number(thisMonthRevenue._sum.amount || 0)
    const previousRevenue = Number(lastMonthRevenue._sum.amount || 0)
    const revenueChange = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0

    return {
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        change: revenueChange,
      },
      activeBookings,
      fleetUtilization: utilization,
      totalCars,
    }
  }),

  // Get recent bookings for dashboard
  getRecentBookings: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      return prisma.booking.findMany({
        take: input.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          car: true,
          user: true,
          payments: {
            where: {
              type: 'RENTAL_FEE',
            },
          },
        },
      })
    }),

  // Get revenue chart data
  getRevenueChart: adminProcedure
    .input(
      z.object({
        months: z.number().min(1).max(12).default(7),
      })
    )
    .query(async ({ input }) => {
      const months = []
      const now = new Date()

      for (let i = input.months - 1; i >= 0; i--) {
        const date = subMonths(now, i)
        const start = startOfMonth(date)
        const end = endOfMonth(date)

        const revenue = await prisma.payment.aggregate({
          where: {
            status: 'SUCCEEDED',
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          _sum: {
            amount: true,
          },
        })

        months.push({
          month: start.toISOString(),
          revenue: revenue._sum.amount || 0,
        })
      }

      return months
    }),

  // Get fleet utilization data
  getFleetUtilization: adminProcedure.query(async () => {
    const now = new Date()
    const thirtyDaysAgo = subMonths(now, 1)

    const cars = await prisma.car.findMany({
      where: { status: 'ACTIVE' },
      include: {
        bookings: {
          where: {
            status: {
              in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'],
            },
            startDate: { gte: thirtyDaysAgo },
          },
        },
      },
    })

    const utilization = cars.map((car: any) => {
      const totalDays = 30
      const bookedDays = car.bookings.reduce((sum: number, booking: any) => {
        const start = booking.startDate > thirtyDaysAgo ? booking.startDate : thirtyDaysAgo
        const end = booking.endDate < now ? booking.endDate : now
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        return sum + days
      }, 0)

      return {
        car: car.displayName,
        utilization: Math.min((bookedDays / totalDays) * 100, 100),
        bookings: car.bookings.length,
      }
    })

    // Sort by utilization
    utilization.sort((a: any, b: any) => b.utilization - a.utilization)

    const overallUtilization = utilization.length > 0
      ? utilization.reduce((sum: number, car: any) => sum + car.utilization, 0) / utilization.length
      : 0

    return {
      overall: overallUtilization,
      byVehicle: utilization,
    }
  }),
})
