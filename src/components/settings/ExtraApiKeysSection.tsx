import type { ApiPair } from '../../lib/validation/settingsSchema'

interface ExtraApiKeysSectionProps {
  apiPairs: ApiPair[]
  onAddPair: () => void
  onRemovePair: (index: number) => void
  onUpdatePair: (index: number, patch: Partial<ApiPair>) => void
}

export function ExtraApiKeysSection({
  apiPairs,
  onAddPair,
  onRemovePair,
  onUpdatePair,
}: ExtraApiKeysSectionProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Future API Keys</h2>
          <p className="mt-1 text-sm text-slate-600">Store additional API keys for upcoming modules.</p>
        </div>
        <button
          type="button"
          onClick={onAddPair}
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
              onChange={(event) => onUpdatePair(index, { key: event.target.value })}
              placeholder="api_name"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <input
              value={pair.value}
              onChange={(event) => onUpdatePair(index, { value: event.target.value })}
              placeholder="api_value"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <button
              type="button"
              onClick={() => onRemovePair(index)}
              className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
