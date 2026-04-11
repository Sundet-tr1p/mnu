// === src/app/(dashboard)/notifications/page.tsx ===
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'

const typeLabels: Record<string, string> = {
  NEW_MESSAGE: '💬 Новое сообщение',
  NEW_REVIEW: '⭐ Новый отзыв',
  NEW_LIKE: '❤️ Новый лайк',
  NEW_COMMENT: '💬 Новый комментарий',
}

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  const notifications = await prisma.notification.findMany({
    where: { userId: user!.userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <div className="mb-2 text-4xl">🔔</div>
          <p>Уведомлений пока нет</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl border bg-white p-4 ${n.isRead ? 'border-gray-100' : 'border-blue-200 bg-blue-50'}`}
            >
              <div className="text-sm font-medium text-gray-900">
                {typeLabels[n.type] || n.type}
              </div>
              {n.data && <p className="mt-1 text-xs text-gray-500">{n.data}</p>}
              <p className="mt-1 text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
