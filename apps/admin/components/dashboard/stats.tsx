'use client'

import { useState, useEffect } from 'react'
import { Car, Calendar, CreditCard, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@valore/ui'

interface StatsData {
  totalRevenue: number
  activeBookings: number
  fleetUtilization: number
  avgBookingValue: number
  totalVehicles: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch real dashboard statistics from API
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalRevenue: data.totalRevenue,
          activeBookings: data.activeBookings,
          fleetUtilization: data.fleetUtilization,
          avgBookingValue: data.avgBookingValue,
          totalVehicles: data.totalVehicles
        })
      } else {
        // Fallback if API fails
        setStats({
          totalRevenue: 0,
          activeBookings: 0,
          fleetUtilization: 0,
          avgBookingValue: 0,
          totalVehicles: 0
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Fallback to empty stats
      setStats({
        totalRevenue: 0,
        activeBookings: 0,
        fleetUtilization: 0,
        avgBookingValue: 0,
        totalVehicles: 0
      })
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card animate-pulse">
            <div className="h-20 bg-neutral-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const statsConfig = [
    {
      name: 'Total Revenue',
      value: stats.totalRevenue > 0 ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      change: stats.totalRevenue > 0 ? '+12.5%' : 'No data',
      changeType: stats.totalRevenue > 0 ? 'positive' : 'neutral',
      icon: CreditCard,
      description: stats.totalRevenue > 0 ? 'from bookings' : 'no bookings yet',
    },
    {
      name: 'Active Bookings',
      value: stats.activeBookings.toString(),
      change: stats.activeBookings > 0 ? '+' + stats.activeBookings : 'No bookings',
      changeType: stats.activeBookings > 0 ? 'positive' : 'neutral',
      icon: Calendar,
      description: stats.activeBookings > 0 ? 'currently active' : 'awaiting bookings',
    },
    {
      name: 'Fleet Utilization',
      value: `${stats.fleetUtilization}%`,
      change: stats.fleetUtilization > 0 ? `${stats.totalVehicles - (stats.totalVehicles - Math.floor(stats.totalVehicles * stats.fleetUtilization / 100))} active` : 'No active vehicles',
      changeType: stats.fleetUtilization > 50 ? 'positive' : 'neutral',
      icon: Car,
      description: `${stats.totalVehicles} total vehicles`,
    },
    {
      name: 'Avg Booking Value',
      value: stats.avgBookingValue > 0 ? `$${stats.avgBookingValue.toLocaleString()}` : '$0',
      change: stats.avgBookingValue > 0 ? 'Per booking' : 'No bookings',
      changeType: stats.avgBookingValue > 0 ? 'positive' : 'neutral',
      icon: TrendingUp,
      description: stats.totalRevenue > 0 ? 'average per rental' : 'no data yet',
    },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => (
        <div key={stat.name} className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {stat.value}
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-neutral-600">{stat.description}</span>
              </div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <stat.icon className="h-6 w-6 text-neutral-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
