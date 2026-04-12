'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useLocale } from '@/components/layout/LocaleProvider'
import { SCHOOL_OPTIONS, formatSchoolTrilingual } from '@/lib/schools'

export default function RegisterPage() {
  const { t } = useLocale()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    role: 'STUDENT',
    school: 'ISE',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ submit: data.error || t('registerError') })
        return
      }

      // Сервер ставит cookie — сразу в ленту (отдельный вход не нужен)
      router.push('/feed')
      router.refresh()
    } catch {
      setErrors({ submit: t('connectingError') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="animate-fade-in w-full max-w-md shadow-xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">{t('appTitle')}</h1>
      <p className="mb-6 text-center text-gray-600">{t('registerTitle')}</p>

      {errors.submit && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="name"
          label={t('name')}
          placeholder="Иван"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          type="text"
          name="surname"
          label={t('surname')}
          placeholder="Иванов"
          value={formData.surname}
          onChange={handleChange}
          error={errors.surname}
          required
        />
        <Input
          type="email"
          name="email"
          label={t('email')}
          placeholder="student@kazguu.kz"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          type="password"
          name="password"
          label={t('password')}
          placeholder="••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Роль</span>
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="STUDENT">Студент</option>
              <option value="TEACHER">Преподаватель</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{t('faculty')}</span>
            <select
              name="school"
              value={formData.school}
              onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              {SCHOOL_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {formatSchoolTrilingual(s)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('registerButton')}
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        {t('haveAccount')}{' '}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          {t('loginLink')}
        </Link>
      </p>
    </Card>
  )
}
