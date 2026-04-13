import { cookies } from 'next/headers'
import { LOCALE_COOKIE_NAME, Locale, translations, TranslationKey } from '@/lib/i18n'

export function getServerLocale(): Locale {
  const c = cookies().get(LOCALE_COOKIE_NAME)?.value
  if (c === 'kz' || c === 'ru' || c === 'en') return c
  return 'ru'
}

export function st(locale: Locale, key: TranslationKey): string {
  return translations[key][locale]
}
