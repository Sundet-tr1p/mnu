import { Prisma } from '@prisma/client'

/** Короткая подсказка пользователю/в JSON без утечки паролей */
export function prismaErrorUserHint(error: unknown): string | null {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const m = error.message
    if (m.includes('P1011') || m.includes('TLS') || m.includes('certificate') || m.includes('SSL')) {
      return 'База данных (TLS): в Vercel в DATABASE_URL добавьте в конец ?sslaccept=accept_invalid_certs (или &sslaccept=accept_invalid_certs, если ? уже есть).'
    }
    if (m.includes('P1001') || m.includes("Can't reach database")) {
      return 'База данных недоступна: проверьте DATABASE_URL (публичный хост Railway, не .internal) и Redeploy.'
    }
    return 'Ошибка подключения к базе данных. Проверьте DATABASE_URL на Vercel.'
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P1001') {
      return 'Нет связи с MySQL. Проверьте DATABASE_URL и что Railway MySQL запущен.'
    }
  }

  const msg = error instanceof Error ? error.message : String(error)
  if (msg.includes('P1011') || msg.includes('TLS') || msg.includes('certificate')) {
    return 'База данных (TLS): добавьте в DATABASE_URL параметр sslaccept=accept_invalid_certs.'
  }
  if (msg.includes('P1001') || msg.includes("Can't reach database")) {
    return 'Нет связи с базой. Проверьте DATABASE_URL на Vercel.'
  }

  return null
}
