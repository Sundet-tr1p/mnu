import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import Sidebar from '@/components/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import Image from 'next/image'
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'
import { ThemeToggleInline } from '../../components/layout/ThemeToggleInline'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <div className="app-background flex min-h-screen">
      <div className="hidden h-screen overflow-hidden md:block">
        <Sidebar user={user} />
      </div>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="glass-panel sticky top-0 z-40 flex items-center justify-between border-b border-gray-200/80 px-4 py-3 dark:border-slate-700/40 md:hidden">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-950/50 dark:ring-white/10">
              <Image src="/mnu-logo.jpeg" alt="MNU" fill className="object-cover" priority />
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">MNU</div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggleInline />
            <LocaleSwitcher />
          </div>
        </header>

        <main className="subtle-scrollbar flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
        <MobileNav />
      </div>
    </div>
  )
}
