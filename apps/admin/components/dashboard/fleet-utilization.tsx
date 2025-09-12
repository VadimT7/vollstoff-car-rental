'use client'

import { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Vehicle {
  id: string
  displayName: string
  status: string
  utilization?: number
  bookings?: number
}

export function FleetUtilization() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (response.ok) {
        const data = await response.json()
        // Use actual utilization data from database
        const vehiclesWithStats = data.map((vehicle: Vehicle) => ({
          ...vehicle,
          utilization: vehicle.utilization || 0,
          bookings: (vehicle as any).bookingsCount || 0
        }))
        setVehicles(vehiclesWithStats)
      } else {
        setVehicles([])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
      setVehicles([])
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-64 bg-neutral-200 rounded"></div>
      </div>
    )
  }

  const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE')
  const totalVehicles = vehicles.length
  const avgUtilization = activeVehicles.length > 0 
    ? Math.round(activeVehicles.reduce((sum, v) => sum + (v.utilization || 0), 0) / activeVehicles.length)
    : 0

  const chartData = {
    labels: ['Utilized', 'Available'],
    datasets: [
      {
        data: [avgUtilization, 100 - avgUtilization],
        backgroundColor: ['rgb(181, 153, 104)', 'rgb(229, 229, 229)'],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.parsed + '%'
          },
        },
      },
    },
    cutout: '70%',
  }
  return (
    <div className="stat-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Fleet Utilization</h3>
        <p className="text-sm text-neutral-600 mt-1">
          Current month utilization by vehicle
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Chart */}
        <div className="relative h-48">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900">{avgUtilization}%</p>
              <p className="text-sm text-neutral-600">Overall</p>
            </div>
          </div>
        </div>

        {/* Top performers */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-700">Top Performers</p>
          {activeVehicles
            .sort((a, b) => (b.utilization || 0) - (a.utilization || 0))
            .slice(0, 3)
            .map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 truncate pr-2">{item.displayName}</span>
                <span className="font-medium text-neutral-900">{item.utilization}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${item.utilization}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
