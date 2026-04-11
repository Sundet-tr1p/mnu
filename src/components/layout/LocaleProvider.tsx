'use client'

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { LOCALE_STORAGE_KEY, Locale, translations, TranslationKey } from '@/lib/i18n'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru')

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (stored === 'kz' || stored === 'ru' || stored === 'en') {
      setLocaleState(stored)
    }
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  }

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: TranslationKey) => translations[key][locale],
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
