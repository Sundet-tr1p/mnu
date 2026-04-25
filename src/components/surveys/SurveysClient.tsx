'use client'

import { useState } from 'react'
import { useLocale } from '@/components/layout/LocaleProvider'
import { dateLocaleTag } from '@/lib/i18n'

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
  const { t } = useLocale()
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
        setError(data.error || t('saveError'))
        return
      }
      setSurveys((prev) => [data.survey as Survey, ...prev])
      setTitle('')
      setLink('')
    } catch {
      setError(t('networkErrorShort'))
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
        setError(data.error || t('saveError'))
        return
      }
      const updated = data.survey as Survey
      setSurveys((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } catch {
      setError(t('networkErrorShort'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-slate-100">{t('surveysPageTitle')}</h1>

      {canEdit && (
        <div className="fx-border mb-6 rounded-2xl">
          <div className="fx-card space-y-3 rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">{t('surveyAdd')}</div>
          {error && (
            <p className="rounded-xl bg-red-50 p-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </p>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('surveyName')}
            className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
          />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={t('surveyLink')}
            className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={createSurvey}
              disabled={saving || !title.trim() || !link.trim()}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
            >
              {saving ? t('saving') : t('create')}
            </button>
          </div>
          </div>
        </div>
      )}

      {surveys.length === 0 ? (
        <div className="py-12 text-center text-gray-400 dark:text-slate-500">
          <p>{t('noSurveysYet')}</p>
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
  const { t, locale } = useLocale()
  const dateTag = dateLocaleTag(locale)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(survey.title)
  const [link, setLink] = useState(survey.link)

  return (
    <div className="fx-border rounded-2xl">
      <div className="fx-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
              />
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-xl border border-gray-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-950/60"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  disabled={saving || !title.trim() || !link.trim()}
                  onClick={async () => {
                    await onUpdate(survey.id, { title, link })
                    setEditing(false)
                  }}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
                >
                  {saving ? t('saving') : t('save')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="truncate font-semibold text-gray-900 dark:text-slate-100">{survey.title}</h2>
              <a
                href={survey.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block break-all text-sm text-blue-700 hover:underline dark:text-indigo-200"
              >
                {survey.link}
              </a>
              <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                {new Date(survey.createdAt).toLocaleDateString(dateTag)}
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
              className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
            >
              {t('surveyOpen')}
            </a>
          )}
          {canEdit && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-950/60"
            >
              {t('edit')}
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

