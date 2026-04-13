'use client'

import { useMemo, useState } from 'react'
import { useLocale } from '@/components/layout/LocaleProvider'

type Faq = {
  id: string
  question: string
  answer: string
  order: number
}

export default function FaqClient({ initialFaqs, canEdit }: { initialFaqs: Faq[]; canEdit: boolean }) {
  const { t } = useLocale()
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const sorted = useMemo(() => [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [faqs])

  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [newOrder, setNewOrder] = useState<number>(0)

  async function createFaq() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer, order: newOrder }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('saveError'))
        return
      }
      setFaqs((prev) => [...prev, data.faq as Faq])
      setNewQuestion('')
      setNewAnswer('')
      setNewOrder(0)
    } catch {
      setError(t('networkErrorShort'))
    } finally {
      setSaving(false)
    }
  }

  async function saveFaq(id: string, patch: Partial<Pick<Faq, 'question' | 'answer' | 'order'>>) {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/faq', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('saveError'))
        return
      }
      const updated = data.faq as Faq
      setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
    } catch {
      setError(t('networkErrorShort'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('faqPageTitle')}</h1>

      {canEdit && (
        <div className="mb-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-sm font-semibold text-gray-900">{t('faqAdd')}</div>
          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={t('question')}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder={t('answer')}
            rows={8}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={newOrder}
            onChange={(e) => setNewOrder(Number(e.target.value))}
            placeholder={t('order')}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={createFaq}
              disabled={saving || !newQuestion.trim() || !newAnswer.trim()}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? t('saving') : t('create')}
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p>{t('noFaqYet')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((faq) => (
            <FaqItem key={faq.id} faq={faq} canEdit={canEdit} saving={saving} onSave={saveFaq} />
          ))}
        </div>
      )}
    </div>
  )
}

function FaqItem({
  faq,
  canEdit,
  saving,
  onSave,
}: {
  faq: { id: string; question: string; answer: string; order: number }
  canEdit: boolean
  saving: boolean
  onSave: (id: string, patch: Partial<{ question: string; answer: string; order: number }>) => Promise<void>
}) {
  const { t } = useLocale()
  const [editing, setEditing] = useState(false)
  const [question, setQuestion] = useState(faq.question)
  const [answer, setAnswer] = useState(faq.answer)
  const [order, setOrder] = useState<number>(faq.order ?? 0)

  return (
    <details className="group rounded-2xl border border-gray-200 bg-white p-5" open={editing}>
      <summary className="flex list-none items-center justify-between font-semibold text-gray-900">
        <span className="mr-3 flex-1">{faq.question}</span>
        <span className="flex items-center gap-2">
          {canEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setEditing((v) => !v)
              }}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200"
            >
              {editing ? t('closeForm') : t('edit')}
            </button>
          )}
          <span className="text-gray-400 transition-transform group-open:rotate-180">▼</span>
        </span>
      </summary>

      {editing ? (
        <div className="mt-3 space-y-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={saving || !question.trim() || !answer.trim()}
              onClick={async () => {
                await onSave(faq.id, { question, answer, order })
                setEditing(false)
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm text-gray-600">{faq.answer}</p>
      )}
    </details>
  )
}

