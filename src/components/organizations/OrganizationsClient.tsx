'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale } from '@/components/layout/LocaleProvider'

type Org = {
  id: string
  name: string
  description: string
  icon: string | null
  logoUrl?: string | null
}

function isDataUrl(src: string) {
  return src.startsWith('data:')
}

export default function OrganizationsClient({ organizations }: { organizations: Org[] }) {
  const { t } = useLocale()
  const [items, setItems] = useState<Org[]>(organizations)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setItems(organizations)
  }, [organizations])

  useEffect(() => {
    const es = new EventSource('/api/organizations/stream')

    const onOrganizations = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { organizations?: Org[] }
        const incoming = data.organizations || []
        if (incoming.length === 0) return
        setItems((prev) => {
          const existing = new Set(prev.map((o) => o.id))
          const merged = [...incoming.filter((o) => !existing.has(o.id)), ...prev]
          return merged
        })
      } catch {
        // ignore
      }
    }

    es.addEventListener('organizations', onOrganizations)
    return () => {
      es.removeEventListener('organizations', onOrganizations)
      es.close()
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, icon, logoUrl: logoUrl || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('createFailed'))
        return
      }
      setName('')
      setDescription('')
      setIcon('')
      setLogoUrl('')
      setShowForm(false)
      // new organization will arrive via SSE
    } catch {
      setError(t('networkErrorShort'))
    } finally {
      setSubmitting(false)
    }
  }

  async function onPickLogo(file: File | null) {
    if (!file) return
    setError('')
    setUploadingLogo(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/uploads/org-logo', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('uploadFailed'))
        return
      }
      setLogoUrl(String(data.url || ''))
    } catch {
      setError(t('uploadFailed'))
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('orgPageTitle')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{items.length}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 dark:from-indigo-600 dark:to-blue-600"
        >
          {showForm ? t('closeForm') : t('openCommunity')}
        </button>
      </div>

      {showForm && (
        <div className="fx-border mb-5 rounded-2xl">
          <form onSubmit={onSubmit} className="fx-card space-y-3 rounded-2xl p-4">
            {error && <p className="rounded-xl bg-red-50 p-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-200">{error}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('communityName')}
                className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
                required
              />
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder={t('iconEmoji')}
                className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
              />
            </div>
          <div className="rounded-xl border border-gray-200 p-3">
            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-slate-200">{t('logoUpload')}</div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickLogo(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-gray-800 hover:file:bg-gray-200 dark:text-slate-200 dark:file:bg-white/10 dark:file:text-slate-100 dark:hover:file:bg-white/15"
              />
              {uploadingLogo && <span className="text-xs text-gray-500">{t('uploading')}</span>}
            </div>
            {logoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 dark:border-slate-700/50 dark:bg-slate-950/40 dark:ring-white/10">
                  <Image
                    src={logoUrl}
                    alt="logo preview"
                    fill
                    className="object-cover"
                    unoptimized={isDataUrl(logoUrl)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-xs font-medium text-gray-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-950/60"
                >
                  {t('remove')}
                </button>
              </div>
            )}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('description')}
            rows={6}
            className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || uploadingLogo}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
            >
              {submitting ? t('saving') : t('create')}
            </button>
          </div>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div className="py-12 text-center text-gray-400 dark:text-slate-500">
          <p>{t('noOrgsYet')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((org) => (
            <div key={org.id} className="fx-border rounded-2xl">
              <div className="fx-card h-full rounded-2xl p-5">
              <div className="mb-2 flex items-center gap-3">
                {org.logoUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 dark:border-slate-700/50 dark:bg-slate-950/40 dark:ring-white/10">
                    <Image
                      src={org.logoUrl}
                      alt={org.name}
                      fill
                      className="object-cover"
                      unoptimized={isDataUrl(org.logoUrl)}
                    />
                  </div>
                ) : (
                  <span className="text-2xl">{org.icon || '🏛️'}</span>
                )}
                <h2 className="font-semibold text-gray-900 dark:text-slate-100">{org.name}</h2>
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-slate-300">{org.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

