import { Providers } from '../providers'
import { DashboardContent } from './dashboard-content'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <DashboardContent>
        {children}
      </DashboardContent>
    </Providers>
  )
}
