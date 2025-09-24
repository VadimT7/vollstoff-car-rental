'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  CreditCard,
  FileText,
  Settings,
  Package,
  MapPin,
  BarChart3,
  MessageSquare,
  Shield
} from 'lucide-react'
import { cn } from '@valore/ui'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Fleet', href: '/fleet', icon: Car },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Availability', href: '/availability', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Featured Fleet', href: '/featured', icon: Package },
  // { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-neutral-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="VollStoff Rentals Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-semibold text-lg text-primary">VollStoff Rentals Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                'sidebar-link',
                isActive && 'active'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
        <div className="p-4 border-t border-neutral-200">
          <div className="text-xs text-neutral-500">
            <p>© 2024 VollStoff Rentals</p>
            <p className="mt-1">Admin Panel v1.0</p>
          </div>
        </div>
    </div>
  )
}
