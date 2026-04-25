'use client'

import clsx from 'clsx'
import { localeLabels, Locale } from '@/lib/i18n'
import { useLocale } from '@/components/layout/LocaleProvider'

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex gap-1 rounded-xl border border-gray-200/70 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-slate-950/40">
      {(Object.keys(localeLabels) as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={clsx(
            'rounded-lg px-2.5 py-1 text-xs font-semibold transition',
            locale === code
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white',
          )}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  )
}
