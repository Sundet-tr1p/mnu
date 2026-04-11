'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useLocale } from '@/components/layout/LocaleProvider'

const items = [
  { href: '/feed', labelKey: 'feed' as const },
  { href: '/chats', labelKey: 'chats' as const },
  { href: '/profile', labelKey: 'profile' as const },
]

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useLocale()
  return (
    <nav className="glass-panel fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-gray-200/80 py-2 md:hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            'rounded-lg px-3 py-2 text-sm transition',
            pathname === item.href
              ? 'bg-blue-50 font-semibold text-blue-700'
              : 'text-gray-600 hover:bg-gray-100',
          )}
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
