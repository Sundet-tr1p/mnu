import prisma from '@/lib/db'
import { NotificationType } from '@prisma/client'

export const IMPORTANT_NOTIFICATION_TYPES = [
  NotificationType.NEW_ORGANIZATION,
  NotificationType.FAQ_UPDATED,
  NotificationType.SURVEY_UPDATED,
] as const

export function isImportantNotificationType(type: string): boolean {
  return (IMPORTANT_NOTIFICATION_TYPES as readonly string[]).includes(type)
}

/** Одна запись уведомления на каждого пользователя (важные новости портала). */
export async function notifyAllUsersImportant(
  type:
    | typeof NotificationType.NEW_ORGANIZATION
    | typeof NotificationType.FAQ_UPDATED
    | typeof NotificationType.SURVEY_UPDATED,
  payload: { title: string; detail?: string; meta?: Record<string, unknown> },
) {
  const users = await prisma.user.findMany({ select: { id: true } })
  if (users.length === 0) return

  const data = JSON.stringify({
    title: payload.title,
    detail: payload.detail ?? null,
    ...payload.meta,
  })

  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      type,
      data,
    })),
  })
}
