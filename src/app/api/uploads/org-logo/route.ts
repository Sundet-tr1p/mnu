import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth-api'
import { errorResponse, successResponse } from '@/lib/api-response'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

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

  const maxBytes = 2 * 1024 * 1024
  if (file.size > maxBytes) {
    return errorResponse('Максимальный размер файла 2MB', 400)
  }

  const ext = extFromMime(file.type)
  if (!ext) {
    return errorResponse('Неподдерживаемый формат (png/jpg/webp/gif)', 400)
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const name = `${crypto.randomUUID()}.${ext}`

  const publicDir = path.join(process.cwd(), 'public', 'uploads', 'org-logos')
  await fs.mkdir(publicDir, { recursive: true })

  const fullPath = path.join(publicDir, name)
  await fs.writeFile(fullPath, bytes)

  const url = `/uploads/org-logos/${name}`
  return successResponse({ url }, 201)
}

