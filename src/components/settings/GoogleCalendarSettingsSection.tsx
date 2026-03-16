import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { SettingsFormValues } from '../../lib/validation/settingsSchema'

interface GoogleCalendarSettingsSectionProps {
  register: UseFormRegister<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function GoogleCalendarSettingsSection({ register, errors }: GoogleCalendarSettingsSectionProps) {
  return (
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
  )
}
