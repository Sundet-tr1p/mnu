import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

const authRoutes = ['/login', '/register']
const protectedPrefixes = [
  '/feed',
  '/profile',
  '/organizations',
  '/chats',
  '/reviews',
  '/faq',
  '/surveys',
  '/notifications',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  const userPromise = token ? verifyToken(token) : Promise.resolve(null)

  return userPromise.then((user) => {
    if (isProtected && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/feed', request.url))
    }

    return NextResponse.next()
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
