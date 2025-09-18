'use client'

import { useEffect, useState } from 'react'
import { Activity, TrendingUp, Users, Car, AlertTriangle, Clock } from 'lucide-react'
import { Card } from '@valore/ui'
import { motion } from 'framer-motion'

interface LiveMetric {
  label: string
  value: string | number
  change?: number
  icon: any
  color: string
  pulse?: boolean
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([])
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Initial fetch
    fetchLiveMetrics()
    
    // Update every 30 seconds
    const interval = setInterval(() => {
      fetchLiveMetrics()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchLiveMetrics = async () => {
    try {
      // Fetch real-time data
      const [bookingsRes, vehiclesRes] = await Promise.all([
        fetch('/api/bookings?limit=10'),
        fetch('/api/vehicles')
      ])

      const bookings = await bookingsRes.json()
      const vehicles = await vehiclesRes.json()

      // Calculate live metrics
      const todayBookings = bookings.filter((b: any) => {
        const bookingDate = new Date(b.createdAt)
        const today = new Date()
        return bookingDate.toDateString() === today.toDateString()
      }).length

      const activeRentals = bookings.filter((b: any) => 
        b.status === 'IN_PROGRESS'
      ).length

      const pendingPickups = bookings.filter((b: any) => {
        const startDate = new Date(b.startDate)
        const today = new Date()
        return startDate.toDateString() === today.toDateString() && 
               b.status === 'CONFIRMED'
      }).length

      const availableVehicles = vehicles.filter((v: any) => 
        v.status === 'ACTIVE'
      ).length

      const maintenanceNeeded = vehicles.filter((v: any) => 
        v.status === 'MAINTENANCE'
      ).length

      setMetrics([
        {
          label: 'Today\'s Bookings',
          value: todayBookings,
          change: todayBookings > 0 ? 100 : 0,
          icon: Activity,
          color: 'text-green-600',
          pulse: todayBookings > 0
        },
        {
          label: 'Active Rentals',
          value: activeRentals,
          icon: Car,
          color: 'text-blue-600',
          pulse: activeRentals > 0
        },
        {
          label: 'Pending Pickups',
          value: pendingPickups,
          icon: Clock,
          color: 'text-amber-600',
          pulse: pendingPickups > 0
        },
        {
          label: 'Available Cars',
          value: availableVehicles,
          icon: Car,
          color: 'text-green-600'
        },
        {
          label: 'Maintenance',
          value: maintenanceNeeded,
          icon: AlertTriangle,
          color: maintenanceNeeded > 0 ? 'text-red-600' : 'text-gray-400',
          pulse: maintenanceNeeded > 0
        }
      ])

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch live metrics:', error)
    }
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-amber-600" />
          Live Dashboard
        </h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-neutral-600">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  {metric.pulse && (
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-2xl font-bold text-neutral-900">{metric.value}</p>
                <p className="text-xs text-neutral-600 mt-1">{metric.label}</p>
                {metric.change !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{metric.change}%</span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-amber-200">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4 text-xs text-neutral-600">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              Normal Operations
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 bg-amber-500 rounded-full" />
              Attention Needed
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              Critical
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
