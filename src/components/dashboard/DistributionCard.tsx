interface DistributionCardProps {
  title: string
  items: Array<{ label: string; value: number }>
  formatValue?: (value: number) => string
}

export function DistributionCard({ title, items, formatValue = (value) => String(value) }: DistributionCardProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
              <span className="truncate">{item.label}</span>
              <span className="font-medium text-slate-900">{formatValue(item.value)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900"
                style={{ width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}