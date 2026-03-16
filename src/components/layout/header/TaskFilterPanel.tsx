import { priorityOptions, statusOptions } from '../../../hooks/useTaskHeaderControls'
import type { TaskFilters } from '../../../types'

interface TaskFilterPanelProps {
  filters: TaskFilters
  categoryOptions: string[]
  tagOptions: string[]
  onClearAll: () => void
  onToggleMultiSelect: (
    current: string[],
    value: string,
    key: 'statuses' | 'priorities' | 'categories' | 'tags',
  ) => void
}

export function TaskFilterPanel({
  filters,
  categoryOptions,
  tagOptions,
  onClearAll,
  onToggleMultiSelect,
}: TaskFilterPanelProps) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Filters</p>
        <button type="button" onClick={onClearAll} className="text-xs font-medium text-sky-700">
          Clear all
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-700">Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => {
              const selected = filters.statuses.includes(status)
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onToggleMultiSelect(filters.statuses, status, 'statuses')}
                  className={`rounded-full px-2 py-1 text-xs capitalize ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-slate-700">Priority</p>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((priority) => {
              const selected = filters.priorities.includes(priority)
              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() => onToggleMultiSelect(filters.priorities, priority, 'priorities')}
                  className={`rounded-full px-2 py-1 text-xs capitalize ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200'
                  }`}
                >
                  {priority}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-slate-700">Category</p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const selected = filters.categories.includes(category)
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onToggleMultiSelect(filters.categories, category, 'categories')}
                  className={`rounded-full px-2 py-1 text-xs ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-slate-700">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const selected = filters.tags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleMultiSelect(filters.tags, tag, 'tags')}
                  className={`rounded-full px-2 py-1 text-xs ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200'
                  }`}
                >
                  #{tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
