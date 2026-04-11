import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import ReviewForm from '@/components/reviews/ReviewForm'

export default async function ReviewsPage() {
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Отзывы</h1>

      <ReviewForm teachers={teachers} canSubmit={user.role === 'STUDENT'} />

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-gray-400">Отзывов пока нет</p>
        ) : (
          reviews.map((r) => {
            const t = teacherMap[r.teacherId]
            return (
              <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-900">
                    {r.user.name} {r.user.surname}
                  </span>
                  <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="mb-2 text-xs text-gray-500">
                  О преподавателе: {t ? `${t.name} ${t.surname}` : '—'}
                </p>
                <p className="text-sm text-gray-700">{r.comment}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
