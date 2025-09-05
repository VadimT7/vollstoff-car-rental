'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

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
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EUR',
            }).format(context.parsed.y)
          }
          return label
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return '$' + value.toLocaleString()
        },
      },
    },
  },
}

export function RevenueChart() {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const stats = await response.json()
        
        // Create chart data based on real stats
        // For empty database, show flat line at 0
        // For database with data, show current month with actual revenue
        const currentMonth = new Date().getMonth()
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentYear = monthLabels.slice(0, currentMonth + 1)
        
        // Generate data: 0 for all months except current month shows actual revenue
        const revenueData = currentYear.map((_, index) => 
          index === currentMonth ? stats.totalRevenue : 0
        )
        
        const data = {
          labels: currentYear,
          datasets: [
            {
              label: 'Revenue',
              data: revenueData,
              borderColor: 'rgb(181, 153, 104)',
              backgroundColor: 'rgba(181, 153, 104, 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        }
        
        setChartData(data)
      } else {
        // Fallback to empty chart
        setChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Revenue',
              data: [0, 0, 0, 0, 0, 0, 0],
              borderColor: 'rgb(181, 153, 104)',
              backgroundColor: 'rgba(181, 153, 104, 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch revenue data:', error)
      // Empty chart on error
      setChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Revenue',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: 'rgb(181, 153, 104)',
            backgroundColor: 'rgba(181, 153, 104, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      })
      setLoading(false)
    }
  }

  if (loading || !chartData) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-64 bg-neutral-200 rounded"></div>
      </div>
    )
  }
  // Check if there's any revenue data
  const hasRevenue = chartData.datasets[0].data.some((value: number) => value > 0)

  return (
    <div className="stat-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <p className="text-sm text-neutral-600 mt-1">
          Monthly revenue for the current year
        </p>
      </div>
      <div className="h-64">
        {hasRevenue ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-neutral-400 mb-2">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-neutral-500 text-sm">No revenue data yet</p>
              <p className="text-neutral-400 text-xs mt-1">Revenue will appear here once you have bookings</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
