import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import ReviewForm from '@/components/reviews/ReviewForm'
import { dateLocaleTag } from '@/lib/i18n'
import { getServerLocale, st } from '@/lib/i18n-server'

export default async function ReviewsPage() {
  const locale = getServerLocale()
  const dateTag = dateLocaleTag(locale)
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { id: true, name: true, surname: true },
    orderBy: { surname: 'asc' },
  })

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { name: true, surname: true } },
    },
  })

  const teacherIds = Array.from(new Set(reviews.map((r) => r.teacherId)))
  const teacherRows = await prisma.user.findMany({
    where: { id: { in: teacherIds } },
    select: { id: true, name: true, surname: true },
  })
  const teacherMap = Object.fromEntries(teacherRows.map((t) => [t.id, t]))

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-slate-100">{st(locale, 'reviewsPageTitle')}</h1>

      <ReviewForm teachers={teachers} canSubmit={user.role === 'STUDENT'} />

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-gray-400 dark:text-slate-500">{st(locale, 'noReviewsYet')}</p>
        ) : (
          reviews.map((r) => {
            const t = teacherMap[r.teacherId]
            return (
              <div key={r.id} className="fx-border rounded-2xl">
                <div className="fx-card rounded-2xl p-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {r.user.name} {r.user.surname}
                  </span>
                  <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">
                  {st(locale, 'reviewAboutTeacher')}{' '}
                  {t ? `${t.name} ${t.surname}` : st(locale, 'emDash')}
                </p>
                <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-slate-200">{r.comment}</p>
                <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                  {new Date(r.createdAt).toLocaleDateString(dateTag)}
                </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
