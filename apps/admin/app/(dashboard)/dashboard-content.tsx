'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ToastContainer } from '@/components/ui/toast-notification'

interface DashboardContentProps {
  children: React.ReactNode
}

export function DashboardContent({ children }: DashboardContentProps) {
  // Simple mock user since we're using cookie-based auth
  const mockUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@flyrentals.com',
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header user={mockUser} />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      {/* Toast notifications */}
      <ToastContainer />
    </div>
  )
}