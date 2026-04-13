import { z } from 'zod'
import { SCHOOL_OPTIONS } from '@/lib/schools'

const RAW_EMAIL_DOMAINS =
  process.env.ALLOWED_EMAIL_DOMAINS ||
  process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS ||
  process.env.ALLOWED_EMAIL_DOMAIN ||
  process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN ||
  'kazguu.kz,mnu.kz'

const ALLOWED_DOMAINS = RAW_EMAIL_DOMAINS.split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean)

export const registerSchema = z.object({
  email: z
    .string()
    .email('Неправильный email')
    .refine(
      (value) => {
        const email = value.trim().toLowerCase()
        return ALLOWED_DOMAINS.some((d) => email.endsWith(`@${d}`))
      },
      { message: `Email должен быть: ${ALLOWED_DOMAINS.map((d) => `@${d}`).join(' или ')}` },
    ),
  password: z.string().min(6, 'Пароль минимум 6 символов').max(50, 'Пароль максимум 50 символов'),
  name: z.string().min(2, 'Имя минимум 2 символа').max(50),
  surname: z.string().min(2, 'Фамилия минимум 2 символа').max(50),
  role: z.enum(['STUDENT', 'TEACHER'], { message: 'Укажите роль' }),
  school: z.enum(SCHOOL_OPTIONS, { message: 'Укажите факультет' }),
})

export const loginSchema = z.object({
  email: z.string().email('Неправильный email'),
  password: z.string().min(1, 'Пароль обязателен'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export const postCreateSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(200),
  content: z.string().min(1, 'Текст обязателен').max(10000),
})

export const commentCreateSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(5000),
})

export const messageCreateSchema = z.object({
  chatId: z.string().min(1),
  text: z.string().min(1).max(5000),
})

export const reviewCreateSchema = z.object({
  teacherId: z.string().min(1),
  comment: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  surname: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional().nullable(),
  school: z.enum(SCHOOL_OPTIONS).optional().nullable(),
  specialty: z.string().max(100).optional().nullable(),
})

export const organizationCreateSchema = z.object({
  name: z.string().min(2, 'Название минимум 2 символа').max(120),
  description: z.string().min(5, 'Описание минимум 5 символов').max(2000),
  icon: z.string().max(32).optional().nullable(),
  logoUrl: z.string().optional().nullable(),
})

export const faqCreateSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int().min(0).optional(),
})

export const faqUpdateSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
})

export const surveyCreateSchema = z.object({
  title: z.string().min(2).max(200),
  link: z.string().url('Нужна корректная ссылка'),
})

export const surveyUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2).max(200).optional(),
  link: z.string().url().optional(),
})
