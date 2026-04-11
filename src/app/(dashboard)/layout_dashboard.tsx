import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
