import { NavLink } from 'react-router-dom'

const mobileNavItems = [
  { label: 'Inbox', to: '/task-planner' },
  { label: 'Today', to: '/task-planner/today' },
  { label: 'Upcoming', to: '/task-planner/upcoming' },
  { label: 'Overdue', to: '/task-planner/overdue' },
  { label: 'Done', to: '/task-planner/completed' },
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
