'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { JWTPayload } from '@/lib/jwt'
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'
import { useLocale } from '@/components/layout/LocaleProvider'
import { TranslationKey } from '@/lib/i18n'

const menuItems: { href: string; labelKey: TranslationKey; icon: string }[] = [
  { href: '/feed', labelKey: 'feed', icon: '🏠' },
  { href: '/organizations', labelKey: 'organizations', icon: '🗂️' },
  { href: '/chats', labelKey: 'chats', icon: '💬' },
  { href: '/reviews', labelKey: 'reviews', icon: '⭐' },
  { href: '/faq', labelKey: 'faq', icon: '❓' },
  { href: '/surveys', labelKey: 'surveys', icon: '📋' },
]

const accountItems: { href: string; labelKey: TranslationKey; icon: string }[] = [
  { href: '/notifications', labelKey: 'notifications', icon: '🔔' },
  { href: '/profile', labelKey: 'profile', icon: '👤' },
]

export default function Sidebar({ user }: { user: JWTPayload }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLocale()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const initials = user.email.slice(0, 2).toUpperCase()

  return (
    <aside className="glass-panel flex h-full w-72 flex-col border-r border-gray-200/70">
      {/* Logo */}
      <div className="border-b border-gray-100/80 p-4">
        <div className="flex items-center gap-3">
          <div className="pulse-soft relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5">
            <Image src="/mnu-logo.jpeg" alt="MNU" fill className="object-cover" priority />
          </div>
          <div>
            <div className="font-bold text-gray-900">{t('appTitle')}</div>
            <div className="text-xs text-gray-500">{t('appSubtitle')}</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gray-900">{user.email}</div>
            <div className="text-xs text-gray-500">
              {user.role === 'STUDENT'
                ? `📚 ${t('student')}`
                : user.role === 'ADMIN'
                  ? `🛡️ Admin`
                  : `👨‍🏫 ${t('teacher')}`}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t('menu')}
        </p>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:translate-x-0.5 hover:bg-gray-50',
              )}
            >
              <span>{item.icon}</span>
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        <p className="mb-2 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t('account')}
        </p>
        <div className="space-y-1">
          {accountItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:translate-x-0.5 hover:bg-gray-50',
              )}
            >
              <span>{item.icon}</span>
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      </nav>

      {/* Language + Logout */}
      <div className="space-y-2 border-t border-gray-100 p-3">
        <LocaleSwitcher />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <span>↪️</span> {t('logout')}
        </button>
      </div>
    </aside>
  )
}
