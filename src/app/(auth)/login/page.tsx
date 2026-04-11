'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useLocale } from '@/components/layout/LocaleProvider'

export default function LoginPage() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: 'include',
      })
      let data: { error?: string } = {}
      try {
        data = await res.json()
      } catch {
        /* пустой ответ */
      }
      if (!res.ok) {
        setError(data.error || t('loginError'))
        return
      }
      // Полная перезагрузка — cookie из ответа гарантированно уходит в следующий запрос
      window.location.assign('/feed')
    } catch {
      setError(t('connectingError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="animate-fade-in w-full max-w-md shadow-xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">{t('appTitle')}</h1>
      <p className="mb-6 text-center text-gray-600">{t('loginTitle')}</p>
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label={t('email')}
          placeholder="student@kazguu.kz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          label={t('password')}
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('loginButton')}
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
          {t('registerLink')}
        </Link>
      </p>
    </Card>
  )
}
