import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getAuthUser } from '@/lib/auth-api'
import { organizationCreateSchema } from '@/lib/validators'
import { NextRequest } from 'next/server'
import { notifyAllUsersImportant } from '@/lib/notify-important'
import { NotificationType } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const organizations = await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return successResponse({ organizations })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const body = await request.json()
  const parsed = organizationCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const organization = await prisma.organization.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      icon: parsed.data.icon || null,
      logoUrl: parsed.data.logoUrl || null,
    },
  })

  await notifyAllUsersImportant(NotificationType.NEW_ORGANIZATION, {
    title: `Новое сообщество: ${organization.name}`,
    detail: organization.description.slice(0, 200),
    meta: { organizationId: organization.id },
  })

  return successResponse({ organization }, 201)
}
