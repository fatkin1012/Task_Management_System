import { NavLink } from 'react-router-dom'

import { hubModules, plannerNavItems } from '../../app/modules'
import { useTaskStore } from '../../store/taskStore'

export function LeftSidebar() {
  const tasks = useTaskStore((state) => state.tasks)

  const projects = [...new Set(tasks.map((task) => task.projectId?.trim() || 'Unassigned'))]
  const tags = [...new Set(tasks.flatMap((task) => task.tags))]

  return (
    <aside className="sticky top-4 hidden h-[calc(100svh-2rem)] w-72 shrink-0 flex-col rounded-3xl bg-slate-100 p-5 text-slate-900 shadow-sm ring-1 ring-slate-200 lg:flex">
      <div>
        <h1 className="text-xl font-bold">Task Planner Hub</h1>
        <p className="mt-1 text-xs text-slate-500">Modular productivity workspace</p>
      </div>

      <nav className="mt-8 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mb-2 block rounded-xl px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-sky-600 text-white'
                : 'text-slate-700 hover:bg-white hover:text-slate-900'
            }`
          }
        >
          Home
        </NavLink>
        {hubModules.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`
            }
          >
            {item.shortLabel}
          </NavLink>
        ))}
      </nav>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task Views</h2>
        <div className="mt-3 space-y-1">
          {plannerNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm transition ${
                  isActive ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-white hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Projects</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {projects.map((project) => (
            <li key={project} className="rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200">
              {project}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full border border-slate-300 bg-white px-2 py-1">
              #{tag}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
