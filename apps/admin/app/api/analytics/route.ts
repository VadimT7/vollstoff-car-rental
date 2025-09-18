import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching analytics data...')

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - days)

    // Fetch all data in parallel
    const [
      totalBookings,
      totalCustomers,
      totalPayments,
      totalRevenue,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      verifiedCustomers,
      recentBookings,
      recentPayments,
      customerBookings,
      vehicleStats
    ] = await Promise.all([
      // Total bookings
      prisma.booking.count(),
      
      // Total customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      
      // Total payments
      prisma.payment.count(),
      
      // Total revenue
      prisma.payment.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true }
      }),
      
      // Completed bookings
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      
      // Cancelled bookings
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      
      // Pending bookings
      prisma.booking.count({ where: { status: 'PENDING' } }),
      
      // Verified customers (assuming all customers are verified for now)
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      
      // Recent bookings for trends
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          car: { select: { displayName: true, category: true } },
          user: { select: { name: true } }
        }
      }),
      
      // Recent payments for revenue trends
      prisma.payment.findMany({
        where: { status: 'SUCCEEDED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            include: {
              car: { select: { displayName: true, category: true } },
              user: { select: { name: true } }
            }
          }
        }
      }),
      
      // Customer booking counts for retention
      prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        include: {
          _count: { select: { bookings: true } }
        }
      }),
      
      // Vehicle statistics
      prisma.car.findMany({
        include: {
          _count: { select: { bookings: true } }
        }
      })
    ])

    // Calculate metrics
    const totalRevenueAmount = parseFloat(String(totalRevenue._sum.amount || '0'))
    const averageBookingValue = totalBookings > 0 ? totalRevenueAmount / totalBookings : 0
    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0
    
    // Calculate customer retention (customers with more than 1 booking)
    const returningCustomers = customerBookings.filter((c: any) => c._count.bookings > 1).length
    const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0
    
    // Calculate satisfaction score (mock calculation based on completion rate)
    const satisfactionScore = Math.min(100, Math.max(0, completionRate + (100 - cancellationRate) / 2))
    
    // Generate daily revenue data for the last 30 days (optimized)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)
    
    // Fetch all payments for the last 30 days in one query
    const recentPaymentsForChart = await prisma.payment.findMany({
      where: {
        status: 'SUCCEEDED',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        amount: true,
        createdAt: true
      }
    })
    
    // Group payments by date
    const dailyRevenueMap = new Map()
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyRevenueMap.set(dateStr, 0)
    }
    
    recentPaymentsForChart.forEach((payment: any) => {
      const dateStr = payment.createdAt.toISOString().split('T')[0]
      if (dailyRevenueMap.has(dateStr)) {
        dailyRevenueMap.set(dateStr, dailyRevenueMap.get(dateStr) + parseFloat(String(payment.amount)))
      }
    })
    
    const dailyRevenue = Array.from(dailyRevenueMap.entries()).map(([date, amount]) => ({
      date,
      amount
    }))

    // Generate monthly revenue data (optimized)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)
    
    // Fetch all payments for the last 12 months in one query
    const yearPayments = await prisma.payment.findMany({
      where: {
        status: 'SUCCEEDED',
        createdAt: { gte: twelveMonthsAgo }
      },
      select: {
        amount: true,
        createdAt: true
      }
    })
    
    // Group payments by month
    const monthlyRevenueMap = new Map()
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyRevenueMap.set(monthKey, 0)
    }
    
    yearPayments.forEach((payment: any) => {
      const monthKey = payment.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (monthlyRevenueMap.has(monthKey)) {
        monthlyRevenueMap.set(monthKey, monthlyRevenueMap.get(monthKey) + parseFloat(String(payment.amount)))
      }
    })
    
    const monthlyRevenue = Array.from(monthlyRevenueMap.entries()).map(([month, amount]) => ({
      month,
      amount
    }))

    // Calculate booking trends
    const currentPeriodBookings = await prisma.booking.count({
      where: { createdAt: { gte: startDate } }
    })
    
    const previousPeriodBookings = await prisma.booking.count({
      where: { 
        createdAt: { 
          gte: previousStartDate, 
          lt: startDate 
        } 
      }
    })
    
    const bookingChange = previousPeriodBookings > 0 
      ? ((currentPeriodBookings - previousPeriodBookings) / previousPeriodBookings) * 100 
      : 0

    // Calculate revenue trends
    const currentPeriodRevenue = await prisma.payment.aggregate({
      where: { 
        status: 'SUCCEEDED',
        createdAt: { gte: startDate } 
      },
      _sum: { amount: true }
    })
    
    const previousPeriodRevenue = await prisma.payment.aggregate({
      where: { 
        status: 'SUCCEEDED',
        createdAt: { 
          gte: previousStartDate, 
          lt: startDate 
        } 
      },
      _sum: { amount: true }
    })
    
    const currentRevenueAmount = parseFloat(String(currentPeriodRevenue._sum.amount || '0'))
    const previousRevenueAmount = parseFloat(String(previousPeriodRevenue._sum.amount || '0'))
    const revenueChange = previousRevenueAmount > 0 
      ? ((currentRevenueAmount - previousRevenueAmount) / previousRevenueAmount) * 100 
      : 0

    // Group vehicles by category for category performance
    const categoryStats = new Map()
    vehicleStats.forEach((vehicle: any) => {
      const category = vehicle.category || 'Standard'
      if (!categoryStats.has(category)) {
        categoryStats.set(category, { bookings: 0, revenue: 0, count: 0 })
      }
      const stats = categoryStats.get(category)
      stats.bookings += vehicle._count.bookings
      stats.revenue += vehicle._count.bookings * averageBookingValue
      stats.count += 1
    })

    // Get top customers with booking details
    const topCustomers = customerBookings
      .filter((c: any) => c._count.bookings > 0)
      .sort((a: any, b: any) => b._count.bookings - a._count.bookings)
      .slice(0, 5)
      .map((customer: any) => ({
        name: customer.name || 'Unknown Customer',
        bookings: customer._count.bookings,
        revenue: customer._count.bookings * averageBookingValue,
        loyaltyTier: customer._count.bookings >= 10 ? 'GOLD' : 
                     customer._count.bookings >= 5 ? 'SILVER' : 'BRONZE'
      }))

    // Build analytics response
    const analytics = {
      revenue: {
        current: currentRevenueAmount,
        previous: previousRevenueAmount,
        change: Math.round(revenueChange * 100) / 100,
        trend: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'stable',
        daily: dailyRevenue,
        monthly: monthlyRevenue
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        pending: pendingBookings,
        averageValue: Math.round(averageBookingValue),
        averageDuration: 3.5, // Mock value
        conversionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
        change: Math.round(bookingChange * 100) / 100,
        trend: bookingChange > 0 ? 'up' : bookingChange < 0 ? 'down' : 'stable',
        byStatus: [
          { status: 'Completed', count: completedBookings, percentage: Math.round(completionRate) },
          { status: 'Cancelled', count: cancelledBookings, percentage: Math.round(cancellationRate) },
          { status: 'Pending', count: pendingBookings, percentage: totalBookings > 0 ? Math.round((pendingBookings / totalBookings) * 100) : 0 }
        ],
        byCategory: Array.from(categoryStats.entries()).map(([category, stats]: [string, any]) => ({
          category,
          count: stats.bookings,
          revenue: Math.round(stats.revenue)
        }))
      },
      customers: {
        total: totalCustomers,
        verified: verifiedCustomers,
        new: Math.floor(totalCustomers * 0.3), // Mock: 30% are new
        returning: returningCustomers,
        retentionRate: Math.round(retentionRate),
        satisfactionScore: Math.round(satisfactionScore),
        topCustomers: topCustomers,
        byTier: [
          { tier: 'Bronze', count: Math.floor(totalCustomers * 0.6), percentage: 60 },
          { tier: 'Silver', count: Math.floor(totalCustomers * 0.25), percentage: 25 },
          { tier: 'Gold', count: Math.floor(totalCustomers * 0.1), percentage: 10 },
          { tier: 'Platinum', count: Math.floor(totalCustomers * 0.05), percentage: 5 }
        ]
      },
      vehicles: {
        total: vehicleStats.length,
        available: vehicleStats.filter((v: any) => v.status === 'ACTIVE').length,
        rented: vehicleStats.filter((v: any) => v._count.bookings > 0 && v.status === 'ACTIVE').length,
        maintenance: vehicleStats.filter((v: any) => v.status === 'MAINTENANCE').length,
        utilization: vehicleStats.length > 0 ? Math.round((vehicleStats.filter((v: any) => v._count.bookings > 0).length / vehicleStats.length) * 100) : 0,
        topPerformers: vehicleStats
          .filter((v: any) => v._count.bookings > 0)
          .sort((a: any, b: any) => b._count.bookings - a._count.bookings)
          .slice(0, 5)
          .map((vehicle: any) => ({
            name: vehicle.displayName || `${vehicle.make} ${vehicle.model}`,
            bookings: vehicle._count.bookings,
            revenue: Math.round(vehicle._count.bookings * averageBookingValue),
            utilization: Math.round((vehicle._count.bookings / Math.max(1, totalBookings)) * 100)
          })),
        categoryPerformance: Array.from(categoryStats.entries()).map(([category, stats]: [string, any]) => ({
          category,
          bookings: stats.bookings,
          revenue: Math.round(stats.revenue),
          avgPrice: stats.bookings > 0 ? Math.round(stats.revenue / stats.bookings) : 0
        }))
      },
      recent: {
        bookings: recentBookings.slice(0, 5).map((booking: any) => ({
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          customer: booking.user?.name || 'Unknown',
          vehicle: booking.car?.displayName || 'Unknown',
          amount: parseFloat(String(booking.totalAmount)),
          status: booking.status,
          createdAt: booking.createdAt
        })),
        payments: recentPayments.slice(0, 5).map((payment: any) => ({
          id: payment.id,
          bookingNumber: payment.booking?.bookingNumber || 'N/A',
          customer: payment.booking?.user?.name || 'Unknown',
          amount: parseFloat(String(payment.amount)),
          status: payment.status,
          createdAt: payment.createdAt
        }))
      }
    }

    console.log('✅ Analytics data generated successfully')

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('❌ Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
