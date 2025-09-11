'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Activity,
  Shield,
  UserPlus
} from 'lucide-react'
import { Button, Card, Input } from '@valore/ui'
import { formatCurrency } from '@valore/ui'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'

// Chart Bar Component for Interactive Tooltips
function ChartBar({ day, heightPercentage }: { day: any, heightPercentage: number }) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div className="flex-1 flex flex-col items-center justify-end h-full relative">
      <div 
        className={`w-full rounded-t-md transition-all duration-300 cursor-pointer ${
          day.amount > 0 
            ? 'bg-amber-500 hover:bg-amber-600' 
            : 'bg-neutral-200 hover:bg-neutral-300'
        }`}
        style={{ height: `${heightPercentage}%` }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      
      {/* Interactive Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-neutral-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <div className="text-xs font-medium">
              {format(new Date(day.date), 'MMM d, yyyy')}
            </div>
            <div className="text-sm font-bold">
              ${(day.amount || 0).toLocaleString()}
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              <div className="border-4 border-transparent border-t-neutral-900" />
            </div>
          </div>
        </div>
      )}
      
      <span className="text-xs text-neutral-500 mt-2 whitespace-nowrap">
        {format(new Date(day.date), 'MMM d')}
      </span>
    </div>
  )
}

interface Analytics {
  revenue: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down' | 'stable'
    daily: Array<{ date: string; amount: number }>
    monthly: Array<{ month: string; amount: number }>
  }
  bookings: {
    total: number
    completed: number
    cancelled: number
    pending: number
    averageValue: number
    averageDuration: number
    conversionRate: number
    byStatus: Array<{ status: string; count: number; percentage: number }>
    byCategory: Array<{ category: string; count: number; revenue: number }>
  }
  customers: {
    total: number
    new: number
    returning: number
    verified: number
    topCustomers: Array<{ 
      name: string; 
      bookings: number; 
      revenue: number;
      loyaltyTier?: string 
    }>
    satisfaction: number
    retentionRate: number
  }
  vehicles: {
    total: number
    active: number
    utilization: number
    topPerformers: Array<{
      name: string;
      bookings: number;
      revenue: number;
      utilization: number
    }>
    categoryPerformance: Array<{
      category: string;
      bookings: number;
      revenue: number;
      avgPrice?: number
    }>
  }
  performance: {
    peakHours: Array<{ hour: string; bookings: number }>
    peakDays: Array<{ day: string; bookings: number }>
    seasonalTrends: Array<{ month: string; bookings: number; revenue: number }>
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

    const fetchAnalytics = async () => {
    try {
      console.log('📊 Fetching analytics from API...')
      const response = await fetch('/api/analytics?days=30')
      if (response.ok) {
        const apiAnalytics = await response.json()
        console.log('✅ Analytics fetched successfully', apiAnalytics)
        
        // Map the API response to the expected structure
        const mappedAnalytics: Analytics = {
          revenue: apiAnalytics.revenue || { current: 0, previous: 0, change: 0, trend: 'stable', daily: [], monthly: [] },
          bookings: {
            total: apiAnalytics.bookings?.total || 0,
            completed: apiAnalytics.bookings?.completed || 0,
            cancelled: apiAnalytics.bookings?.cancelled || 0,
            pending: apiAnalytics.bookings?.pending || 0,
            averageValue: apiAnalytics.bookings?.averageValue || 0,
            averageDuration: apiAnalytics.bookings?.averageDuration || 0,
            conversionRate: apiAnalytics.bookings?.conversionRate || 0,
            byStatus: apiAnalytics.bookings?.byStatus || [],
            byCategory: apiAnalytics.bookings?.byCategory || []
          },
          customers: {
            total: apiAnalytics.customers?.total || 0,
            new: apiAnalytics.customers?.new || 0,
            returning: apiAnalytics.customers?.returning || 0,
            verified: apiAnalytics.customers?.verified || 0,
            topCustomers: apiAnalytics.customers?.topCustomers || [],
            satisfaction: apiAnalytics.customers?.satisfactionScore || 0,
            retentionRate: apiAnalytics.customers?.retentionRate || 0
          },
          vehicles: {
            total: apiAnalytics.vehicles?.total || 0,
            active: apiAnalytics.vehicles?.available || 0,
            utilization: apiAnalytics.vehicles?.utilization || 0,
            topPerformers: apiAnalytics.vehicles?.topPerformers || [],
            categoryPerformance: apiAnalytics.vehicles?.categoryPerformance || []
          },
          performance: {
            peakHours: [],
            peakDays: [],
            seasonalTrends: []
          }
        }
        
        setAnalytics(mappedAnalytics)
      } else {
        console.error('❌ Failed to fetch analytics:', response.status)
        setAnalytics(null)
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error)
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-neutral-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Analytics & Reports</h1>
          <p className="text-neutral-600 mt-2">Track performance metrics and business insights</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>


      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                ${analytics?.revenue?.current?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(analytics?.revenue?.trend || 'neutral')}
                <span className={`text-sm font-medium ${
                  analytics?.revenue?.trend === 'up' ? 'text-green-600' : 
                  analytics?.revenue?.trend === 'down' ? 'text-red-600' : 'text-neutral-600'
                }`}>
                  {Math.abs(analytics?.revenue?.change || 0)}%
                </span>
                <span className="text-sm text-neutral-600">vs last period</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600">Total Bookings</p>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{analytics?.bookings?.total || 0}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-neutral-600">
                  {analytics?.bookings?.conversionRate || 0}% conversion
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600">Active Customers</p>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{analytics?.customers?.total || 0}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-green-600">+{analytics?.customers?.new || 0} new</span>
                <span className="text-sm text-neutral-600">this month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600">Fleet Utilization</p>
            <Car className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{analytics?.vehicles?.utilization || 0}%</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-neutral-600">
                  {analytics?.vehicles?.active || 0}/{analytics?.vehicles?.total || 0} active
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">Revenue Overview</h3>
            <div className="group relative">
              <AlertCircle className="h-4 w-4 text-neutral-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  Revenue is shown for the date when payment was received
                  <div className="absolute bottom-0 left-4 translate-y-full">
                    <div className="border-4 border-transparent border-t-neutral-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-lg">
              Daily Revenue
            </span>
          </div>
        </div>
        
        {/* Revenue Chart - Enhanced with Y-axis and Interactive Tooltips */}
        <div className="h-64 relative flex">
          {analytics?.revenue?.daily && analytics.revenue.daily.length > 0 ? (
            <>
              {/* Y-axis */}
              <div className="flex flex-col justify-between pr-2 text-xs text-neutral-600">
                {(() => {
                  const dailyData = analytics.revenue.daily || []
                  const maxAmount = Math.max(...dailyData.map(d => d.amount || 0), 1000)
                  const steps = 5
                  return Array.from({ length: steps }).map((_, i) => {
                    const value = Math.round((maxAmount / (steps - 1)) * (steps - 1 - i))
                    return (
                      <div key={i} className="text-right">
                        ${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                      </div>
                    )
                  })
                })()}
              </div>
              
              {/* Chart */}
              <div className="flex-1 relative">
                <div className="h-full flex items-end gap-1">
                  {analytics.revenue.daily.slice(-14).map((day, idx) => {
                    const dailyData = analytics.revenue.daily || []
                    const maxAmount = Math.max(...dailyData.map(d => d.amount || 0), 1000)
                    const heightPercentage = day.amount > 0 
                      ? Math.max(10, (day.amount / maxAmount) * 100)
                      : 5
                    
                    return (
                      <ChartBar 
                        key={idx}
                        day={day}
                        heightPercentage={heightPercentage}
                      />
                    )
                  })}
                </div>
                
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="border-t border-neutral-200 opacity-50" />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-neutral-500">No revenue data available for the selected period</p>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vehicles */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Performing Vehicles</h3>
          <div className="space-y-3">
            {(analytics?.vehicles?.topPerformers || []).map((vehicle, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-amber-700">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{vehicle.name}</p>
                    <p className="text-sm text-neutral-600">
                      {vehicle.bookings} bookings • {vehicle.utilization}% utilization
                    </p>
                  </div>
                </div>
                <p className="font-medium text-neutral-900">${vehicle.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {(analytics?.customers?.topCustomers || []).map((customer, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{customer.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600">
                        {customer.bookings} bookings
                      </span>
                      {customer.loyaltyTier && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          customer.loyaltyTier === 'GOLD' ? 'bg-yellow-100 text-yellow-700' :
                          customer.loyaltyTier === 'SILVER' ? 'bg-gray-100 text-gray-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {customer.loyaltyTier}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="font-medium text-neutral-900">${customer.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Performance - Simplified */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Category Performance</h3>
          <div className="space-y-4">
            {(analytics?.vehicles?.categoryPerformance || []).map((category, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-neutral-900">{category.category}</span>
                  <span className="text-sm text-neutral-600">
                    ${(category.revenue || 0).toLocaleString()} ({category.bookings} bookings)
                  </span>
                </div>
                <div className="w-full bg-amber-500 rounded-full h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Booking Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Booking Status Distribution</h3>
          <div className="space-y-3">
            {(analytics?.bookings?.byStatus || []).map((status, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status.status === 'Completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {status.status === 'Pending' && <Clock className="h-5 w-5 text-yellow-600" />}
                  {status.status === 'Cancelled' && <XCircle className="h-5 w-5 text-red-600" />}
                  <span className="font-medium text-neutral-900">{status.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600">{status.count} bookings</span>
                  <span className="text-sm font-medium text-neutral-900">{status.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Average Booking Value</span>
              <span className="font-medium text-neutral-900">${analytics?.bookings?.averageValue || 0}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-neutral-600">Average Duration</span>
              <span className="font-medium text-neutral-900">{analytics?.bookings?.averageDuration || 0} days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Metrics - Enhanced with meaningful data */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Customer Insights</h3>
          <div className="text-sm text-neutral-600">
            Based on {analytics?.customers?.total || 0} total customers
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Active Customers */}
          <div className="relative group">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-green-700">
                  {analytics?.customers?.total || 0}
                </span>
              </div>
              <p className="text-sm font-medium text-neutral-900">Total Customers</p>
              <p className="text-xs text-neutral-600 mt-1">
                +{analytics?.customers?.new || 0} new this month
              </p>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Total unique customers who have made at least one booking
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Repeat Customer Rate */}
          <div className="relative group">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-blue-700">
                  {analytics?.customers?.returning || 0}
                </span>
              </div>
              <p className="text-sm font-medium text-neutral-900">Repeat Customers</p>
              <p className="text-xs text-neutral-600 mt-1">
                {analytics?.customers?.total 
                  ? `${((analytics.customers.returning / analytics.customers.total) * 100).toFixed(0)}% of total`
                  : '0% of total'}
              </p>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Customers who have made more than one booking
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Average Customer Value */}
          <div className="relative group">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold text-purple-700">
                  ${analytics?.customers?.total && analytics?.revenue?.current
                    ? Math.round(analytics.revenue.current / analytics.customers.total).toLocaleString()
                    : '0'}
                </span>
              </div>
              <p className="text-sm font-medium text-neutral-900">Avg Customer Value</p>
              <p className="text-xs text-neutral-600 mt-1">
                Lifetime revenue per customer
              </p>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Total revenue divided by total customers
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Frequency */}
          <div className="relative group">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-amber-700">
                  {analytics?.customers?.total && analytics?.bookings?.total
                    ? (analytics.bookings.total / analytics.customers.total).toFixed(1)
                    : '0'}
                </span>
              </div>
              <p className="text-sm font-medium text-neutral-900">Avg Bookings</p>
              <p className="text-xs text-neutral-600 mt-1">
                Per customer
              </p>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Average number of bookings per customer
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Customer Insights */}
        <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="text-xs text-neutral-600">Verified Customers</p>
              <p className="text-lg font-semibold text-neutral-900">{analytics?.customers?.verified || 0}</p>
            </div>
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="text-xs text-neutral-600">New This Month</p>
              <p className="text-lg font-semibold text-neutral-900">{analytics?.customers?.new || 0}</p>
            </div>
            <UserPlus className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="text-xs text-neutral-600">Conversion Rate</p>
              <p className="text-lg font-semibold text-neutral-900">{analytics?.bookings?.conversionRate || 0}%</p>
            </div>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </div>
        </div>
      </Card>
    </div>
  )
}

