'use client'

import { useState } from 'react'

type Survey = {
  id: string
  title: string
  link: string
  createdAt: string | Date
}

export default function SurveysClient({
  initialSurveys,
  canEdit,
}: {
  initialSurveys: Survey[]
  canEdit: boolean
}) {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')

  async function createSurvey() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения')
        return
      }
      setSurveys((prev) => [data.survey as Survey, ...prev])
      setTitle('')
      setLink('')
    } catch {
      setError('Ошибка сети')
    } finally {
      setSaving(false)
    }
  }

  async function updateSurvey(id: string, patch: Partial<Pick<Survey, 'title' | 'link'>>) {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/surveys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения')
        return
      }
      const updated = data.survey as Survey
      setSurveys((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } catch {
      setError('Ошибка сети')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Опросы</h1>

      {canEdit && (
        <div className="mb-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-sm font-semibold text-gray-900">Добавить опрос</div>
          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Ссылка (https://...)"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={createSurvey}
              disabled={saving || !title.trim() || !link.trim()}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </div>
      )}

      {surveys.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p>Опросов пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {surveys.map((survey) => (
            <SurveyItem
              key={survey.id}
              survey={survey}
              canEdit={canEdit}
              saving={saving}
              onUpdate={updateSurvey}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SurveyItem({
  survey,
  canEdit,
  saving,
  onUpdate,
}: {
  survey: Survey
  canEdit: boolean
  saving: boolean
  onUpdate: (id: string, patch: Partial<{ title: string; link: string }>) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(survey.title)
  const [link, setLink] = useState(survey.link)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  disabled={saving || !title.trim() || !link.trim()}
                  onClick={async () => {
                    await onUpdate(survey.id, { title, link })
                    setEditing(false)
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="truncate font-semibold text-gray-900">{survey.title}</h2>
              <a
                href={survey.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block break-all text-sm text-blue-600 hover:underline"
              >
                {survey.link}
              </a>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(survey.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!editing && (
            <a
              href={survey.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
            >
              Открыть →
            </a>
          )}
          {canEdit && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Редактировать
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

