'use client'

import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SimpleButton } from '@/components/ui/simple-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      // Fallback: just redirect to login
      router.push('/login')
    }
  }
  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-6">
      <div className="h-full flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="search"
              placeholder="Search bookings, customers, cars..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-neutral-600" />
                {/* Red dot will appear when there are actual notifications */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-6 text-center">
                <Bell className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-900 mb-1">No notifications</p>
                <p className="text-xs text-neutral-500">
                  You'll see booking updates, payments, and system alerts here
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">
                    {user.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || ''}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
