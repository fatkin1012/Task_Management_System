import type { ReactNode } from 'react'

interface ModulePageProps {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function ModulePage({ eyebrow, title, description, children }: ModulePageProps) {
  return (
    <section className="space-y-4">
      <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </header>
      {children}
    </section>
  )
}