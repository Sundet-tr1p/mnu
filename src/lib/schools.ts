import type { Locale } from '@/lib/i18n'

/** Совпадает с enum School в prisma/schema.prisma */
export const SCHOOL_CATALOG = [
  { id: 'ISE' as const, en: 'ISE', ru: 'МШЭ', kz: 'ХЭМ' },
  { id: 'SLA' as const, en: 'SLA', ru: 'ВГШ', kz: 'ЖГМ' },
  { id: 'ISJ' as const, en: 'ISJ', ru: 'МШЖ', kz: 'ХЖМ' },
  { id: 'MLS' as const, en: 'MLS', ru: 'ВШП', kz: 'ҚЖМ' },
] as const

export type SchoolId = (typeof SCHOOL_CATALOG)[number]['id']

export const SCHOOL_OPTIONS = ['ISE', 'SLA', 'ISJ', 'MLS'] as const satisfies readonly SchoolId[]

const byId: Record<SchoolId, { en: string; ru: string; kz: string }> = {
  ISE: { en: 'ISE', ru: 'МШЭ', kz: 'ХЭМ' },
  SLA: { en: 'SLA', ru: 'ВГШ', kz: 'ЖГМ' },
  ISJ: { en: 'ISJ', ru: 'МШЖ', kz: 'ХЖМ' },
  MLS: { en: 'MLS', ru: 'ВШП', kz: 'ҚЖМ' },
}

/** Короткое название по текущему языку интерфейса */
export function getSchoolLabel(id: string | null | undefined, locale: Locale): string {
  if (!id) return '—'
  const row = byId[id as SchoolId]
  if (!row) return id
  return row[locale]
}

/** Одна строка: EN — RU — KZ (для регистрации и профиля) */
export function formatSchoolTrilingual(id: string | null | undefined): string {
  if (!id) return '—'
  const row = byId[id as SchoolId]
  if (!row) return id
  return `${row.en} — ${row.ru} — ${row.kz}`
}
