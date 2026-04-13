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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('orgPageTitle')}</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {showForm ? t('closeForm') : t('openCommunity')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mb-5 space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('communityName')}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            required
          />
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder={t('iconEmoji')}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="rounded-xl border border-gray-200 p-3">
            <div className="mb-2 text-sm font-medium text-gray-700">{t('logoUpload')}</div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickLogo(e.target.files?.[0] || null)}
                className="block w-full text-sm"
              />
              {uploadingLogo && <span className="text-xs text-gray-500">{t('uploading')}</span>}
            </div>
            {logoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                  className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 hover:bg-gray-200"
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
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || uploadingLogo}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? t('saving') : t('create')}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p>{t('noOrgsYet')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((org) => (
            <div key={org.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-2 flex items-center gap-3">
                {org.logoUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                <h2 className="font-semibold text-gray-900">{org.name}</h2>
              </div>
              <p className="text-sm text-gray-500">{org.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

