import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import { IMPORTANT_NOTIFICATION_TYPES } from '@/lib/notify-important'
import type { Locale } from '@/lib/i18n'
import { dateLocaleTag } from '@/lib/i18n'
import { getServerLocale, st } from '@/lib/i18n-server'

function importantTypeFallback(locale: Locale, type: string): string {
  if (type === 'NEW_ORGANIZATION') return st(locale, 'notifTypeNewOrganization')
  if (type === 'FAQ_UPDATED') return st(locale, 'notifTypeFaqUpdated')
  if (type === 'SURVEY_UPDATED') return st(locale, 'notifTypeSurveyUpdated')
  return type
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
  const locale = getServerLocale()
  const dateTag = dateLocaleTag(locale)
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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{st(locale, 'notificationsPageTitle')}</h1>
      {notifications.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p>{st(locale, 'noNotificationsYet')}</p>
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
                  {parsed.title || importantTypeFallback(locale, n.type)}
                </div>
                {parsed.detail && (
                  <p className="mt-1 text-xs text-gray-600">{parsed.detail}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString(dateTag)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
