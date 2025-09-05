import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@valore/database'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching analytics data...')

    // Get date range from query params
    const { searchParams } = new URL(request.url)
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
    const totalRevenueAmount = parseFloat(totalRevenue._sum.amount || '0')
    const averageBookingValue = totalBookings > 0 ? totalRevenueAmount / totalBookings : 0
    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0
    
    // Calculate customer retention (customers with more than 1 booking)
    const returningCustomers = customerBookings.filter(c => c._count.bookings > 1).length
    const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0
    
    // Calculate satisfaction score (mock calculation based on completion rate)
    const satisfactionScore = Math.min(100, Math.max(0, completionRate + (100 - cancellationRate) / 2))
    
    // Generate daily revenue data for the last 30 days
    const dailyRevenue = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      
      const dayRevenue = await prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: { gte: dayStart, lte: dayEnd }
        },
        _sum: { amount: true }
      })
      
      dailyRevenue.push({
        date: date.toISOString().split('T')[0],
        amount: parseFloat(dayRevenue._sum.amount || '0')
      })
    }

    // Generate monthly revenue data
    const monthlyRevenue = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthRevenue = await prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: { gte: monthStart, lte: monthEnd }
        },
        _sum: { amount: true }
      })
      
      monthlyRevenue.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: parseFloat(monthRevenue._sum.amount || '0')
      })
    }

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
    
    const currentRevenueAmount = parseFloat(currentPeriodRevenue._sum.amount || '0')
    const previousRevenueAmount = parseFloat(previousPeriodRevenue._sum.amount || '0')
    const revenueChange = previousRevenueAmount > 0 
      ? ((currentRevenueAmount - previousRevenueAmount) / previousRevenueAmount) * 100 
      : 0

    // Build analytics response
    const analytics = {
      revenue: {
        current: currentRevenueAmount,
        previous: previousRevenueAmount,
        change: revenueChange,
        trend: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'stable',
        daily: dailyRevenue,
        monthly: monthlyRevenue
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        pending: pendingBookings,
        averageValue: averageBookingValue,
        averageDuration: 3.5, // Mock value
        conversionRate: 85, // Mock value
        change: bookingChange,
        trend: bookingChange > 0 ? 'up' : bookingChange < 0 ? 'down' : 'stable',
        byStatus: [
          { status: 'Completed', count: completedBookings, percentage: completionRate },
          { status: 'Cancelled', count: cancelledBookings, percentage: cancellationRate },
          { status: 'Pending', count: pendingBookings, percentage: (pendingBookings / totalBookings) * 100 }
        ],
        byCategory: vehicleStats.map(vehicle => ({
          category: vehicle.category || 'Unknown',
          count: vehicle._count.bookings,
          revenue: vehicle._count.bookings * averageBookingValue
        }))
      },
      customers: {
        total: totalCustomers,
        verified: verifiedCustomers,
        new: Math.floor(totalCustomers * 0.3), // Mock: 30% are new
        returning: returningCustomers,
        retentionRate: retentionRate,
        satisfactionScore: Math.round(satisfactionScore),
        byTier: [
          { tier: 'Bronze', count: Math.floor(totalCustomers * 0.6), percentage: 60 },
          { tier: 'Silver', count: Math.floor(totalCustomers * 0.25), percentage: 25 },
          { tier: 'Gold', count: Math.floor(totalCustomers * 0.1), percentage: 10 },
          { tier: 'Platinum', count: Math.floor(totalCustomers * 0.05), percentage: 5 }
        ]
      },
      vehicles: {
        total: vehicleStats.length,
        available: vehicleStats.filter(v => v.status === 'AVAILABLE').length,
        rented: vehicleStats.filter(v => v.status === 'RENTED').length,
        maintenance: vehicleStats.filter(v => v.status === 'MAINTENANCE').length,
        utilization: vehicleStats.length > 0 ? (vehicleStats.filter(v => v._count.bookings > 0).length / vehicleStats.length) * 100 : 0,
        topPerformers: vehicleStats
          .sort((a, b) => b._count.bookings - a._count.bookings)
          .slice(0, 5)
          .map(vehicle => ({
            name: vehicle.displayName,
            bookings: vehicle._count.bookings,
            revenue: vehicle._count.bookings * averageBookingValue,
            utilization: (vehicle._count.bookings / Math.max(1, totalBookings)) * 100
          }))
      },
      recent: {
        bookings: recentBookings.slice(0, 5).map(booking => ({
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          customer: booking.user?.name || 'Unknown',
          vehicle: booking.car?.displayName || 'Unknown',
          amount: parseFloat(booking.totalAmount),
          status: booking.status,
          createdAt: booking.createdAt
        })),
        payments: recentPayments.slice(0, 5).map(payment => ({
          id: payment.id,
          bookingNumber: payment.booking?.bookingNumber || 'N/A',
          customer: payment.booking?.user?.name || 'Unknown',
          amount: parseFloat(payment.amount),
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
