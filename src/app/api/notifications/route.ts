import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { successResponse, errorResponse } from '@/lib/api-response'
import { IMPORTANT_NOTIFICATION_TYPES } from '@/lib/notify-important'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const list = await prisma.notification.findMany({
    where: {
      userId: user.userId,
      type: { in: [...IMPORTANT_NOTIFICATION_TYPES] },
    },
    orderBy: { createdAt: 'desc' },
  })
  return successResponse({ notifications: list })
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const body = await request.json()
  if (body.markAll) {
    await prisma.notification.updateMany({
      where: { userId: user.userId, isRead: false },
      data: { isRead: true },
    })
    return successResponse({ ok: true })
  }
  if (body.id && typeof body.id === 'string') {
    const n = await prisma.notification.findFirst({
      where: { id: body.id, userId: user.userId },
    })
    if (!n) return errorResponse('Не найдено', 404)
    await prisma.notification.update({
      where: { id: body.id },
      data: { isRead: true },
    })
    return successResponse({ ok: true })
  }
  return errorResponse('Нужно id или markAll', 400)
}
