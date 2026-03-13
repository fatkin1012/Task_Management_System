import { NavLink } from 'react-router-dom'

import { useTaskStore } from '../../store/taskStore'

const navItems = [
  { label: 'Inbox', to: '/task-planner' },
  { label: 'Today', to: '/task-planner/today' },
  { label: 'Upcoming', to: '/task-planner/upcoming' },
  { label: 'Overdue', to: '/task-planner/overdue' },
  { label: 'Completed', to: '/task-planner/completed' },
]

export function LeftSidebar() {
  const tasks = useTaskStore((state) => state.tasks)

  const projects = [...new Set(tasks.map((task) => task.category))]
  const tags = [...new Set(tasks.flatMap((task) => task.tags))]

  return (
    <aside className="sticky top-4 hidden h-[calc(100svh-2rem)] w-72 shrink-0 flex-col rounded-3xl bg-slate-900 p-5 text-slate-100 lg:flex">
      <div>
        <h1 className="text-xl font-bold">Task Planner</h1>
        <p className="mt-1 text-xs text-slate-400">Smart productivity workspace</p>
      </div>

      <nav className="mt-8 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mb-2 block rounded-xl px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-sky-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          Home
        </NavLink>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Projects</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-200">
          {projects.map((project) => (
            <li key={project} className="rounded-lg bg-slate-800 px-3 py-1.5">
              {project}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tags</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full border border-slate-600 px-2 py-1">
              #{tag}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
