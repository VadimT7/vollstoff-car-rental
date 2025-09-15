import { Providers } from '../providers'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ToastContainer } from '@/components/ui/toast-notification'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For development/demo purposes, create a mock admin user
  const mockUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'flyrentalsca@gmail.com',
    role: 'ADMIN',
    image: null
  }

  return (
    <Providers>
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
      </div>
      {/* Toast notifications */}
      <ToastContainer />
    </Providers>
  )
}
