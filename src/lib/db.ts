import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/** На Vercel в production нельзя создавать новый клиент на каждый запрос — исчерпываются соединения MySQL. */
function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const prisma = globalForPrisma.prisma ?? createClient()
globalForPrisma.prisma = prisma

export default prisma
