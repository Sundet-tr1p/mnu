import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? ''
    : 'dev-only-jwt-secret-change-in-production-min-32-chars')
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function getSecretKey() {
  const secret =
    JWT_SECRET || 'dev-only-jwt-secret-change-in-production-min-32-chars'
  return new TextEncoder().encode(secret)
}

export interface JWTPayload {
  [key: string]: unknown
  userId: string
  email: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
}

export async function createToken(payload: JWTPayload): Promise<string> {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production')
  }
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(getSecretKey())
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    })
    const rawRole = String(payload.role || '').toUpperCase()
    const role: JWTPayload['role'] =
      rawRole === 'ADMIN' || rawRole === 'TEACHER' ? (rawRole as JWTPayload['role']) : 'STUDENT'
    return {
      userId: String(payload.userId || ''),
      email: String(payload.email || ''),
      role,
    }
  } catch {
    return null
  }
}

/** Опции cookie для Route Handlers и для cookies().set() */
export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, getAuthCookieOptions())
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('token')?.value || null
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.set('token', '', { ...getAuthCookieOptions(), maxAge: 0 })
}

export async function getCurrentUser() {
  const token = await getAuthToken()
  if (!token) return null
  return await verifyToken(token)
}
