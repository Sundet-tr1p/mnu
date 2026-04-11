import { NextResponse } from 'next/server'
import { getAuthCookieOptions } from '@/lib/jwt'

export async function POST() {
  const res = NextResponse.json({ message: 'Выход выполнен' })
  res.cookies.set('token', '', { ...getAuthCookieOptions(), maxAge: 0 })
  return res
}
