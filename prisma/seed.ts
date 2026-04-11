import { PrismaClient, ChatType, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 12)

  const student = await prisma.user.upsert({
    where: { email: 'aibek.student@kazguu.kz' },
    update: {},
    create: {
      email: 'aibek.student@kazguu.kz',
      password,
      name: 'Айбек',
      surname: 'Студент',
      role: Role.STUDENT,
      school: 'VSP',
      specialty: 'Право',
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: 'prof.asanov@kazguu.kz' },
    update: {},
    create: {
      email: 'prof.asanov@kazguu.kz',
      password,
      name: 'Асан',
      surname: 'Профессор',
      role: Role.TEACHER,
      school: 'MShZh',
    },
  })

  await prisma.organization.upsert({
    where: { id: 'seed-org-1' },
    update: {},
    create: {
      id: 'seed-org-1',
      name: 'Студенческий совет',
      description: 'Представительство студентов MNU',
      icon: '🏛️',
    },
  })

  await prisma.faq.upsert({
    where: { id: 'seed-faq-1' },
    update: {},
    create: {
      id: 'seed-faq-1',
      question: 'Как сменить пароль?',
      answer: 'Обратитесь в IT-поддержку университета.',
      order: 1,
    },
  })

  await prisma.faq.upsert({
    where: { id: 'seed-faq-2' },
    update: {},
    create: {
      id: 'seed-faq-2',
      question: 'Как сменить роль?',
      answer: 'Обратитесь в IT-поддержку университета.',
      order: 2,
    },
  })

  await prisma.survey.upsert({
    where: { id: 'seed-survey-1' },
    update: {},
    create: {
      id: 'seed-survey-1',
      title: 'Опрос удовлетворённости порталом',
      link: 'https://forms.gle/example',
    },
  })

  const chat = await prisma.chat.upsert({
    where: { id: 'seed-chat-global' },
    update: {},
    create: {
      id: 'seed-chat-global',
      name: 'Общий чат',
      type: ChatType.GLOBAL,
    },
  })

  const vspChat = await prisma.chat.upsert({
    where: { id: 'school-chat-VSP' },
    update: {},
    create: {
      id: 'school-chat-VSP',
      name: 'Факультет VSP',
      type: ChatType.GLOBAL,
    },
  })

  const mshzhChat = await prisma.chat.upsert({
    where: { id: 'school-chat-MShZh' },
    update: {},
    create: {
      id: 'school-chat-MShZh',
      name: 'Факультет MShZh',
      type: ChatType.GLOBAL,
    },
  })

  const loxChat = await prisma.chat.upsert({
    where: { id: 'school-chat-lox' },
    update: {},
    create: {
      id: 'school-chat-lox',
      name: 'Факультет lox',
      type: ChatType.GLOBAL,
    },
  })

  await prisma.chatMember.upsert({
    where: {
      chatId_userId: { chatId: chat.id, userId: student.id },
    },
    update: {},
    create: { chatId: chat.id, userId: student.id },
  })

  await prisma.chatMember.upsert({
    where: {
      chatId_userId: { chatId: vspChat.id, userId: student.id },
    },
    update: {},
    create: { chatId: vspChat.id, userId: student.id },
  })

  await prisma.chatMember.upsert({
    where: {
      chatId_userId: { chatId: mshzhChat.id, userId: teacher.id },
    },
    update: {},
    create: { chatId: mshzhChat.id, userId: teacher.id },
  })

  await prisma.chatMember.upsert({
    where: {
      chatId_userId: { chatId: chat.id, userId: teacher.id },
    },
    update: {},
    create: { chatId: chat.id, userId: teacher.id },
  })

  await prisma.post.upsert({
    where: { id: 'seed-post-1' },
    update: {},
    create: {
      id: 'seed-post-1',
      title: 'Добро пожаловать в UniConnect',
      content: 'Это тестовый пост из сида базы данных.',
      authorId: teacher.id,
    },
  })

  console.log('Seed OK: student + teacher + чат + пост')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
