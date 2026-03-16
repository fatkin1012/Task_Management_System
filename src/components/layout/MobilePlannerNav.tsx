import { NavLink } from 'react-router-dom'

const mobileNavItems = [
  { label: 'Inbox', to: '/hub/tasks' },
  { label: 'Today', to: '/hub/today' },
  { label: 'Upcoming', to: '/hub/tasks/upcoming' },
  { label: 'Overdue', to: '/hub/tasks/overdue' },
  { label: 'Done', to: '/hub/tasks/completed' },
]

export function MobilePlannerNav() {
  return (
    <nav className="lg:hidden">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
