import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { appSettingsService } from '../services/appSettingsService'

const settingsSchema = z.object({
  useMock: z.boolean(),
  clientId: z.string().trim(),
  apiKey: z.string().trim(),
  discoveryDoc: z.string().trim().min(1, 'Discovery doc is required'),
  scopes: z.string().trim().min(1, 'Scopes are required'),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface ApiPair {
  key: string
  value: string
}

export function SettingsPage() {
  const initialSettings = useMemo(() => appSettingsService.getSettings(), [])
  const [message, setMessage] = useState<string | null>(null)
  const [apiPairs, setApiPairs] = useState<ApiPair[]>(
    Object.entries(initialSettings.extraApis).map(([key, value]) => ({ key, value })),
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      useMock: initialSettings.googleCalendar.useMock,
      clientId: initialSettings.googleCalendar.clientId,
      apiKey: initialSettings.googleCalendar.apiKey,
      discoveryDoc: initialSettings.googleCalendar.discoveryDoc,
      scopes: initialSettings.googleCalendar.scopes,
    },
  })

  const updatePair = (index: number, patch: Partial<ApiPair>) => {
    setApiPairs((prev) => prev.map((pair, idx) => (idx === index ? { ...pair, ...patch } : pair)))
  }

  const addPair = () => {
    setApiPairs((prev) => [...prev, { key: '', value: '' }])
  }

  const removePair = (index: number) => {
    setApiPairs((prev) => prev.filter((_, idx) => idx !== index))
  }

  const onSubmit = (values: SettingsFormValues) => {
    const extraApis = apiPairs.reduce<Record<string, string>>((acc, pair) => {
      const key = pair.key.trim()
      const value = pair.value.trim()
      if (key.length > 0 && value.length > 0) {
        acc[key] = value
      }
      return acc
    }, {})

    appSettingsService.saveSettings({
      googleCalendar: {
        useMock: values.useMock,
        clientId: values.clientId,
        apiKey: values.apiKey,
        discoveryDoc: values.discoveryDoc,
        scopes: values.scopes,
      },
      extraApis,
      updatedAt: initialSettings.updatedAt,
    })

    setMessage('Settings saved. Google Calendar connect will now use these values.')
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-5 py-10 md:px-8 md:py-14">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Settings</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">API Configuration</h1>
          <p className="mt-2 text-sm text-slate-600">
            Configure Google Calendar credentials and future API keys from one page.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          Back to Home
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Google Calendar</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use mock mode for demo. Turn off mock mode when real credentials are ready.
          </p>

          <div className="mt-4 space-y-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register('useMock')} className="size-4" />
              Enable mock mode (recommended until OAuth setup is complete)
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Google Client ID</label>
                <input
                  {...register('clientId')}
                  placeholder="YOUR_GOOGLE_CLIENT_ID"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Google API Key</label>
                <input
                  {...register('apiKey')}
                  placeholder="YOUR_GOOGLE_API_KEY"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Discovery Document URL</label>
              <input
                {...register('discoveryDoc')}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
              {errors.discoveryDoc?.message ? (
                <p className="mt-1 text-xs text-rose-600">{errors.discoveryDoc.message}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Scopes</label>
              <input
                {...register('scopes')}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
              {errors.scopes?.message ? (
                <p className="mt-1 text-xs text-rose-600">{errors.scopes.message}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Future API Keys</h2>
              <p className="mt-1 text-sm text-slate-600">
                Store additional API keys for upcoming modules.
              </p>
            </div>
            <button
              type="button"
              onClick={addPair}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
            >
              Add API
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {apiPairs.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                No extra API keys saved yet.
              </p>
            ) : null}

            {apiPairs.map((pair, index) => (
              <div key={`${index}-${pair.key}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <input
                  value={pair.key}
                  onChange={(event) => updatePair(index, { key: event.target.value })}
                  placeholder="api_name"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                <input
                  value={pair.value}
                  onChange={(event) => updatePair(index, { value: event.target.value })}
                  placeholder="api_value"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={() => removePair(index)}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between gap-3">
          {message ? <p className="text-sm text-emerald-700">{message}</p> : <span />}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save Settings
          </button>
        </div>
      </form>
    </main>
  )
}
