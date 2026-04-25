'use client'

import { useTheme } from '@/components/layout/ThemeProvider'
import clsx from 'clsx'

export function ThemeToggleInline() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm backdrop-blur transition',
        'border-gray-200/70 bg-white/70 text-gray-800 hover:bg-white',
        'dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-950/60',
      )}
      aria-label="Toggle theme"
      title={isDark ? 'Dark' : 'Light'}
    >
      <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
    </button>
  )
}

