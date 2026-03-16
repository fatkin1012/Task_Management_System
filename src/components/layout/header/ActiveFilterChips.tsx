import type { TaskFilters } from '../../../types'

interface ActiveFilterChipsProps {
  filters: TaskFilters
  onToggleMultiSelect: (
    current: string[],
    value: string,
    key: 'statuses' | 'priorities' | 'categories' | 'tags',
  ) => void
}

export function ActiveFilterChips({ filters, onToggleMultiSelect }: ActiveFilterChipsProps) {
  const hasFilters =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.categories.length > 0 ||
    filters.tags.length > 0

  if (!hasFilters) {
    return null
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {filters.statuses.map((status) => (
        <button
          key={`chip-status-${status}`}
          type="button"
          onClick={() => onToggleMultiSelect(filters.statuses, status, 'statuses')}
          className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-900"
        >
          status:{status} x
        </button>
      ))}
      {filters.priorities.map((priority) => (
        <button
          key={`chip-priority-${priority}`}
          type="button"
          onClick={() => onToggleMultiSelect(filters.priorities, priority, 'priorities')}
          className="rounded-full bg-slate-900 px-2 py-1 text-xs text-white"
        >
          priority:{priority} x
        </button>
      ))}
      {filters.categories.map((category) => (
        <button
          key={`chip-category-${category}`}
          type="button"
          onClick={() => onToggleMultiSelect(filters.categories, category, 'categories')}
          className="rounded-full bg-sky-100 px-2 py-1 text-xs text-sky-900"
        >
          category:{category} x
        </button>
      ))}
      {filters.tags.map((tag) => (
        <button
          key={`chip-tag-${tag}`}
          type="button"
          onClick={() => onToggleMultiSelect(filters.tags, tag, 'tags')}
          className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-900"
        >
          tag:#{tag} x
        </button>
      ))}
    </div>
  )
}
