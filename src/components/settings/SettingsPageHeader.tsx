import { Link } from 'react-router-dom'

export function SettingsPageHeader() {
  return (
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
  )
}
