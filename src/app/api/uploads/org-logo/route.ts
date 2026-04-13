import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth-api'
import { errorResponse, successResponse } from '@/lib/api-response'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function extFromMime(mime: string): string {
  const m = mime.toLowerCase()
  if (m === 'image/png') return 'png'
  if (m === 'image/jpeg') return 'jpg'
  if (m === 'image/webp') return 'webp'
  if (m === 'image/gif') return 'gif'
  return ''
}

/**
 * Логотип сохраняем как data URL в БД — на Vercel/Railway нет постоянного диска в public/uploads.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return errorResponse('Файл не найден', 400)
  }

  if (!file.type?.startsWith('image/')) {
    return errorResponse('Можно загружать только изображения', 400)
  }

  const maxBytes = 1024 * 1024
  if (file.size > maxBytes) {
    return errorResponse('Максимальный размер файла 1MB', 400)
  }

  const ext = extFromMime(file.type)
  if (!ext) {
    return errorResponse('Неподдерживаемый формат (png/jpg/webp/gif)', 400)
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const base64 = bytes.toString('base64')
  const url = `data:${file.type};base64,${base64}`

  return successResponse({ url }, 201)
}
