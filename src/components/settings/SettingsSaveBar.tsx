interface SettingsSaveBarProps {
  message: string | null
  isSubmitting: boolean
}

export function SettingsSaveBar({ message, isSubmitting }: SettingsSaveBarProps) {
  return (
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
  )
}
