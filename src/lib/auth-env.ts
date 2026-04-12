import { errorResponse } from '@/lib/api-response'
import type { NextResponse } from 'next/server'

/** Прод без секретов/БД даёт 500 без понятного текста — проверяем заранее. */
export function assertServerAuthConfig(): NextResponse | null {
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && !process.env.DATABASE_URL?.trim()) {
    return errorResponse(
      'Сервер не настроен: задайте DATABASE_URL в переменных окружения (Vercel → Settings → Environment Variables).',
      503,
    )
  }

  if (isProd && !process.env.JWT_SECRET?.trim()) {
    return errorResponse(
      'Сервер не настроен: задайте JWT_SECRET в переменных окружения (Vercel → Settings → Environment Variables). Сгенерируйте длинную случайную строку (32+ символов).',
      503,
    )
  }

  return null
}
