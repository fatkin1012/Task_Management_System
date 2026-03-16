interface MetricCardProps {
  label: string
  value: string | number
  tone?: 'neutral' | 'danger' | 'success' | 'warning'
  hint?: string
}

const toneClasses: Record<NonNullable<MetricCardProps['tone']>, string> = {
  neutral: 'bg-white text-slate-900',
  danger: 'bg-rose-50 text-rose-900 ring-rose-100',
  success: 'bg-emerald-50 text-emerald-900 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-900 ring-amber-100',
}

export function MetricCard({ label, value, tone = 'neutral', hint }: MetricCardProps) {
  return (
    <article className={`rounded-2xl p-4 shadow-sm ring-1 ${toneClasses[tone]} ring-slate-200`}>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </article>
  )
}