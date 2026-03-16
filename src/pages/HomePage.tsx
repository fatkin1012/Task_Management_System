import { Link } from 'react-router-dom'

import { hubModules } from '../app/modules'

export function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1200px] px-5 py-10 md:px-8 md:py-14">
      <header className="max-w-3xl">
        <p className="inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Task Planner Hub
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
          Modern productivity system for planning, focus, notes, and calendar flow.
        </h1>
        <p className="mt-4 text-base text-slate-600 md:text-lg">
          Start from the hub dashboard, then move into task management, daily planning,
          scheduling, reminders, notes, and focus workflows.
        </p>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {hubModules.map((card) => {
          const content = (
            <article className="h-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`h-2 rounded-full bg-gradient-to-r ${card.tone}`} />
              <h2 className="mt-5 text-2xl font-bold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{card.description}</p>
              <p className="mt-6 text-sm font-semibold text-sky-700">
                Open module
              </p>
            </article>
          )

          return (
            <Link key={card.title} to={card.to}>
              {content}
            </Link>
          )
        })}
      </section>
    </main>
  )
}
