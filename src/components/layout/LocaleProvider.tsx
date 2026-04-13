'use client'

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import {
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  Locale,
  translations,
  TranslationKey,
} from '@/lib/i18n'

function writeLocaleCookie(next: Locale) {
  if (typeof document === 'undefined') return
  document.cookie = `${LOCALE_COOKIE_NAME}=${next}; path=/; max-age=31536000; SameSite=Lax`
}

function readLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_NAME}=([^;]*)`))
  const v = m?.[1]
  if (v === 'kz' || v === 'ru' || v === 'en') return v
  return null
}

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
      writeLocaleCookie(stored)
      return
    }
    const fromCookie = readLocaleCookie()
    if (fromCookie) {
      setLocaleState(fromCookie)
      localStorage.setItem(LOCALE_STORAGE_KEY, fromCookie)
    }
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
    writeLocaleCookie(next)
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
