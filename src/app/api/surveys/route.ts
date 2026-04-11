import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getAuthUser } from '@/lib/auth-api'
import { surveyCreateSchema, surveyUpdateSchema } from '@/lib/validators'
import { NextRequest } from 'next/server'
import { notifyAllUsersImportant } from '@/lib/notify-important'
import { NotificationType } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const surveys = await prisma.survey.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return successResponse({ surveys })
}

/** Новый опрос — только админ. */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)
  if (user.role !== 'ADMIN') {
    return errorResponse('Только администратор может добавлять опросы', 403)
  }

  const body = await request.json()
  const parsed = surveyCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const survey = await prisma.survey.create({
    data: {
      title: parsed.data.title,
      link: parsed.data.link,
    },
  })

  await notifyAllUsersImportant(NotificationType.SURVEY_UPDATED, {
    title: `Новый опрос: ${survey.title}`,
    detail: survey.link,
    meta: { surveyId: survey.id },
  })

  return successResponse({ survey }, 201)
}

/** Обновление опроса — только админ. */
export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)
  if (user.role !== 'ADMIN') {
    return errorResponse('Только администратор может менять опросы', 403)
  }

  const body = await request.json()
  const parsed = surveyUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const { id, ...rest } = parsed.data
  const survey = await prisma.survey.update({
    where: { id },
    data: rest,
  })

  await notifyAllUsersImportant(NotificationType.SURVEY_UPDATED, {
    title: `Обновлён опрос: ${survey.title}`,
    detail: survey.link,
    meta: { surveyId: survey.id },
  })

  return successResponse({ survey })
}
