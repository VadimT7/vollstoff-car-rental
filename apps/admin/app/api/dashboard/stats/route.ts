import { NextRequest, NextResponse } from 'next/server'
import { vehicleService, bookingService, userService } from '@valore/database'

export async function GET(request: NextRequest) {
  try {
    // Fetch all data in parallel
    const [vehicles, bookings, customers] = await Promise.all([
      vehicleService.findMany(),
      bookingService.findMany({}, { include: { car: true, user: true } }),
      userService.findMany({ where: { role: 'CUSTOMER' } })
    ])

    // Calculate real statistics
    const totalVehicles = vehicles.length
    const activeVehicles = vehicles.filter((v: any) => v.status === 'ACTIVE').length
    const maintenanceVehicles = vehicles.filter((v: any) => v.status === 'MAINTENANCE').length
    
    // Fleet utilization based on active vs total
    const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0
    
    // Booking statistics
    const totalBookings = bookings.length
    const activeBookings = bookings.filter((b: any) => 
      b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS'
    ).length
    const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED').length
    
    // Revenue calculations
    const totalRevenue = bookings.reduce((sum: number, booking: any) => 
      sum + (Number(booking.totalAmount) || 0), 0
    )
    
    const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0
    
    // Pending actions
    const pendingVerifications = customers.filter((c: any) => !c.licenseVerified).length
    const pendingPayments = bookings.filter((b: any) => b.paymentStatus === 'PENDING').length
    const maintenanceScheduled = maintenanceVehicles
    
    // Today's activities - filter bookings by actual dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Find bookings with pickup today (startDate is today)
    const todaysPickups = bookings
      .filter((b: any) => {
        const startDate = new Date(b.startDate)
        startDate.setHours(0, 0, 0, 0)
        return startDate.getTime() === today.getTime() && 
               (b.status === 'CONFIRMED' || b.status === 'PENDING')
      })
      .map((booking: any) => ({
        time: '10:00 AM', // Default pickup time
        vehicle: booking.car?.displayName || 'Unknown Vehicle',
        customer: booking.user?.name || booking.guestName || 'Unknown Customer',
        status: booking.status === 'CONFIRMED' ? 'ready' : 'preparing'
      }))
    
    // Find bookings with return today (endDate is today)
    const todaysReturns = bookings
      .filter((b: any) => {
        const endDate = new Date(b.endDate)
        endDate.setHours(0, 0, 0, 0)
        return endDate.getTime() === today.getTime() && 
               (b.status === 'IN_PROGRESS' || b.status === 'CONFIRMED')
      })
      .map((booking: any) => ({
        time: '10:00 PM', // Default return time
        vehicle: booking.car?.displayName || 'Unknown Vehicle',
        customer: booking.user?.name || booking.guestName || 'Unknown Customer',
        status: 'scheduled'
      }))

    const stats = {
      totalRevenue,
      activeBookings,
      fleetUtilization,
      avgBookingValue,
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      completedBookings,
      pendingActions: {
        verifications: pendingVerifications,
        payments: pendingPayments,
        maintenance: maintenanceScheduled,
        maintenanceVehicleName: vehicles.find((v: any) => v.status === 'MAINTENANCE')?.displayName
      },
      todaysActivities: {
        pickups: todaysPickups,
        returns: todaysReturns
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    
    // Return fallback stats
    return NextResponse.json({
      totalRevenue: 0,
      activeBookings: 0,
      fleetUtilization: 0,
      avgBookingValue: 0,
      totalVehicles: 0,
      activeVehicles: 0,
      maintenanceVehicles: 0,
      completedBookings: 0,
      pendingActions: {
        verifications: 0,
        payments: 0,
        maintenance: 0,
        maintenanceVehicleName: null
      },
      todaysActivities: {
        pickups: [],
        returns: []
      }
    })
  }
}
