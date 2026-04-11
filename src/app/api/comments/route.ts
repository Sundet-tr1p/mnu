import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { commentCreateSchema } from '@/lib/validators'
import { successResponse, errorResponse } from '@/lib/api-response'
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const body = await request.json()
  const parsed = commentCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const post = await prisma.post.findUnique({
    where: { id: parsed.data.postId },
    select: { id: true, authorId: true },
  })
  if (!post) return errorResponse('Пост не найден', 404)

  const comment = await prisma.comment.create({
    data: {
      postId: post.id,
      authorId: user.userId,
      content: parsed.data.content,
    },
    include: {
      author: { select: { name: true, surname: true } },
    },
  })

  return successResponse({ comment }, 201)
}
