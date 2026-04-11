'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewForm({
  teachers,
  canSubmit,
}: {
  teachers: { id: string; name: string; surname: string }[]
  canSubmit: boolean
}) {
  const router = useRouter()
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? '')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !teacherId) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, comment, rating }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'Ошибка')
      return
    }
    setComment('')
    router.refresh()
  }

  if (!canSubmit) {
    return <p className="mb-6 text-sm text-gray-500">Отзывы могут оставлять только студенты.</p>
  }

  if (teachers.length === 0) {
    return <p className="mb-6 text-sm text-gray-500">Нет преподавателей в базе.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-2xl border bg-white p-5">
      <h2 className="font-semibold text-gray-900">Новый отзыв</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <label className="mb-1 block text-sm text-gray-600">Преподаватель</label>
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} {t.surname}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">Оценка</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">Комментарий</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full rounded-lg border px-3 py-2 text-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Отправка…' : 'Отправить'}
      </button>
    </form>
  )
}
