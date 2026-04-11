import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { reviewCreateSchema } from '@/lib/validators'
import { successResponse, errorResponse } from '@/lib/api-response'
export async function GET(request: NextRequest) {
  const teacherId = request.nextUrl.searchParams.get('teacherId')
  const where = teacherId ? { teacherId } : {}

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, surname: true, email: true } },
    },
    take: 100,
  })

  const teacherIds = Array.from(new Set(reviews.map((r) => r.teacherId)))
  const teachers = await prisma.user.findMany({
    where: { id: { in: teacherIds } },
    select: { id: true, name: true, surname: true },
  })
  const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t]))

  const enriched = reviews.map((r) => ({
    ...r,
    teacher: teacherMap[r.teacherId] ?? { name: '?', surname: '' },
  }))

  return successResponse({ reviews: enriched })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)
  if (user.role !== 'STUDENT') {
    return errorResponse('Только студенты могут оставлять отзывы', 403)
  }

  const body = await request.json()
  const parsed = reviewCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const { teacherId, comment, rating } = parsed.data

  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
    select: { id: true, role: true },
  })
  if (!teacher || teacher.role !== 'TEACHER') {
    return errorResponse('Преподаватель не найден', 404)
  }

  try {
    const review = await prisma.review.create({
      data: {
        userId: user.userId,
        teacherId,
        comment,
        rating,
      },
    })

    return successResponse({ review }, 201)
  } catch {
    return errorResponse('Вы уже оставляли отзыв этому преподавателю', 409)
  }
}
