import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import { IMPORTANT_NOTIFICATION_TYPES } from '@/lib/notify-important'

const typeLabels: Record<string, string> = {
  NEW_ORGANIZATION: 'Новое сообщество',
  FAQ_UPDATED: 'Обновление FAQ',
  SURVEY_UPDATED: 'Опросы',
}

function parsePayload(data: string | null): { title?: string; detail?: string } {
  if (!data) return {}
  try {
    const j = JSON.parse(data) as { title?: string; detail?: string }
    return { title: j.title, detail: j.detail ?? undefined }
  } catch {
    return {}
  }
}

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.userId,
      type: { in: [...IMPORTANT_NOTIFICATION_TYPES] },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Уведомления</h1>
      {notifications.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p>Уведомлений пока нет</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const parsed = parsePayload(n.data)
            return (
              <div
                key={n.id}
                className={`rounded-2xl border bg-white p-4 ${
                  n.isRead ? 'border-gray-100' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  {parsed.title || typeLabels[n.type] || n.type}
                </div>
                {parsed.detail && (
                  <p className="mt-1 text-xs text-gray-600">{parsed.detail}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
