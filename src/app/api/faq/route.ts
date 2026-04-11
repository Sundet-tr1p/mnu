import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getAuthUser } from '@/lib/auth-api'
import { faqCreateSchema, faqUpdateSchema } from '@/lib/validators'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } })
  return successResponse({ faqs })
}

/** Создание пункта FAQ — только админ. */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)
  if (user.role !== 'ADMIN') {
    return errorResponse('Только администратор может добавлять FAQ', 403)
  }

  const body = await request.json()
  const parsed = faqCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const faq = await prisma.faq.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      order: parsed.data.order ?? 0,
    },
  })

  return successResponse({ faq }, 201)
}

/** Изменение пункта FAQ — только админ. */
export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)
  if (user.role !== 'ADMIN') {
    return errorResponse('Только администратор может менять FAQ', 403)
  }

  const body = await request.json()
  const parsed = faqUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const { id, ...rest } = parsed.data
  const faq = await prisma.faq.update({
    where: { id },
    data: rest,
  })

  return successResponse({ faq })
}
