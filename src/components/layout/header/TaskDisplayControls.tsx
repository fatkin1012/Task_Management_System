import { CalendarClock, Rows3 } from 'lucide-react'

import { sortOptions, viewModes } from '../../../hooks/useTaskHeaderControls'
import type { TaskGroupBy, TaskSortKey, TaskViewMode } from '../../../types'

interface TaskDisplayControlsProps {
  search: string
  sortKey: TaskSortKey
  currentViewMode: TaskViewMode
  taskGroupBy: TaskGroupBy
  onSearchChange: (search: string) => void
  onSortKeyChange: (sortKey: TaskSortKey) => void
  onGroupByChange: (groupBy: TaskGroupBy) => void
  onViewModeChange: (viewMode: TaskViewMode) => void
}

export function TaskDisplayControls({
  search,
  sortKey,
  currentViewMode,
  taskGroupBy,
  onSearchChange,
  onSortKeyChange,
  onGroupByChange,
  onViewModeChange,
}: TaskDisplayControlsProps) {
  return (
    <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_auto_auto_auto]">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search tasks by title or description"
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
      />
      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
        <Rows3 size={16} />
        Group
        <select
          value={taskGroupBy}
          onChange={(event) => onGroupByChange(event.target.value as TaskGroupBy)}
          className="bg-transparent outline-none"
        >
          <option value="none">None</option>
          <option value="category">Category</option>
          <option value="project">Project</option>
        </select>
      </label>
      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
        <CalendarClock size={16} />
        Sort
        <select
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value as TaskSortKey)}
          className="bg-transparent outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
        {viewModes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onViewModeChange(mode)}
            className={`rounded-lg px-3 py-1.5 capitalize ${
              currentViewMode === mode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  )
}
