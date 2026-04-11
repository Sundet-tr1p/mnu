import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="absolute right-4 top-4">
        <LocaleSwitcher />
      </div>
      <div className="absolute left-4 top-4 hidden items-center gap-3 md:flex">
        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5">
          <Image src="/mnu-logo.jpeg" alt="MNU" fill className="object-cover" priority />
        </div>
        <div className="text-sm font-semibold text-gray-800">MNU</div>
      </div>
      {children}
    </div>
  )
}
