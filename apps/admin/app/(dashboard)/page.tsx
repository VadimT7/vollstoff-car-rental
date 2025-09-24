import { Suspense } from 'react'
import { 
  Car, 
  Calendar, 
  CreditCard, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

import { DashboardStats } from '@/components/dashboard/stats'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { BookingsTable } from '@/components/dashboard/bookings-table'
import { FleetUtilization } from '@/components/dashboard/fleet-utilization'
import { LoadingCard } from '@/components/ui/loading-card'
import { RealTimeMetrics } from '@/components/dashboard/real-time-metrics'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function TodaysActivities() {
  // Fetch real dashboard data including activities
  let activities = { pickups: [], returns: [] }
  let pendingActions = { verifications: 0, payments: 0, maintenance: 0, maintenanceVehicleName: null }
  
  try {
    const response = await fetch('/api/dashboard/stats', { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      activities = data.todaysActivities
      pendingActions = data.pendingActions
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Today's pickups */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Today's Pickups</h3>
          <Car className="h-5 w-5 text-neutral-400" />
        </div>
        <div className="space-y-3">
          {activities.pickups.length > 0 ? activities.pickups.map((item: any, index: number) => (
            <ActivityItem
              key={index}
              time={item.time}
              title={item.vehicle}
              customer={item.customer}
              status={item.status}
            />
          )) : (
            <p className="text-sm text-neutral-500">No pickups scheduled for today</p>
          )}
        </div>
      </div>

      {/* Today's returns */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Today's Returns</h3>
          <Calendar className="h-5 w-5 text-neutral-400" />
        </div>
        <div className="space-y-3">
          {activities.returns.length > 0 ? activities.returns.map((item: any, index: number) => (
            <ActivityItem
              key={index}
              time={item.time}
              title={item.vehicle}
              customer={item.customer}
              status={item.status}
            />
          )) : (
            <p className="text-sm text-neutral-500">No returns scheduled for today</p>
          )}
        </div>
      </div>

      {/* Pending actions */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pending Actions</h3>
          <AlertCircle className="h-5 w-5 text-neutral-400" />
        </div>
        <div className="space-y-3">
          <ActionItem
            type="verification"
            title="License verification"
            description={`${pendingActions.verifications} pending verifications`}
          />
          <ActionItem
            type="payment"
            title="Payment confirmation"
            description={`${pendingActions.payments} pending payments`}
          />
          <ActionItem
            type="maintenance"
            title="Scheduled maintenance"
            description={pendingActions.maintenanceVehicleName ? `${pendingActions.maintenanceVehicleName} scheduled` : 'No maintenance scheduled'}
          />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2">
          Welcome back! Here's an overview of your rental business.
        </p>
      </div>

      {/* Real-time metrics */}
      <Suspense fallback={<LoadingCard />}>
        <RealTimeMetrics />
      </Suspense>

      {/* Stats grid */}
      <Suspense fallback={<LoadingCard count={4} />}>
        <DashboardStats />
      </Suspense>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <Suspense fallback={<LoadingCard />}>
          <RevenueChart />
        </Suspense>

        {/* Fleet utilization */}
        <Suspense fallback={<LoadingCard />}>
          <FleetUtilization />
        </Suspense>
      </div>

      {/* Today's activities */}
      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <LoadingCard key={i} />)}</div>}>
        <TodaysActivities />
      </Suspense>

      {/* Recent bookings table */}
      <div className="stat-card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Latest customer bookings and their status
          </p>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <BookingsTable />
        </Suspense>
      </div>
    </div>
  )
}

function ActivityItem({ 
  time, 
  title, 
  customer, 
  status 
}: {
  time: string
  title: string
  customer: string
  status: 'ready' | 'preparing' | 'pending' | 'completed' | 'scheduled'
}) {
  const statusConfig = {
    ready: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    preparing: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    pending: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    completed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    scheduled: { icon: Calendar, color: 'text-neutral-600', bg: 'bg-neutral-50' },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${config.bg}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{title}</p>
        <p className="text-xs text-neutral-600">{customer}</p>
      </div>
      <span className="text-xs text-neutral-500">{time}</span>
    </div>
  )
}

function ActionItem({
  type,
  title,
  description,
}: {
  type: 'verification' | 'payment' | 'maintenance'
  title: string
  description: string
}) {
  const typeConfig = {
    verification: { icon: Users, color: 'text-blue-600' },
    payment: { icon: CreditCard, color: 'text-green-600' },
    maintenance: { icon: Car, color: 'text-orange-600' },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3">
      <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-600 mt-0.5">{description}</p>
      </div>
    </div>
  )
}
