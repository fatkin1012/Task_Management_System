import { CalendarClock, Filter, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'
import type { TaskFilterPreset, TaskSortKey, TaskViewMode } from '../../types'

interface HeaderBarProps {
  title: string
  preset: TaskFilterPreset
}

const sortOptions: { label: string; value: TaskSortKey }[] = [
  { label: 'Manual', value: 'manual' },
  { label: 'Due date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Created time', value: 'createdAt' },
  { label: 'Status', value: 'status' },
]

const viewModes: TaskViewMode[] = ['list', 'board', 'calendar']

export function HeaderBar({ title, preset }: HeaderBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filters = useTaskStore((state) => state.filters)
  const updateFilters = useTaskStore((state) => state.updateFilters)
  const sortKey = useTaskStore((state) => state.sortKey)
  const setSortKey = useTaskStore((state) => state.setSortKey)
  const tasks = useTaskStore((state) => state.tasks)

  const currentViewMode = useUiStore((state) => state.currentViewMode)
  const setCurrentViewMode = useUiStore((state) => state.setCurrentViewMode)
  const setAddTaskModalOpen = useUiStore((state) => state.setAddTaskModalOpen)

  const categoryOptions = useMemo(
    () => [...new Set(tasks.map((task) => task.category))].sort(),
    [tasks],
  )

  const tagOptions = useMemo(
    () => [...new Set(tasks.flatMap((task) => task.tags))].sort(),
    [tasks],
  )

  const activeFilterCount =
    filters.priorities.length + filters.categories.length + filters.tags.length

  const toggleMultiSelect = (
    current: string[],
    value: string,
    key: 'priorities' | 'categories' | 'tags',
  ) => {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]

    updateFilters({ [key]: next, preset })
  }

  return (
    <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFilterOpen((open) => !open)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          >
            <Filter size={16} />
            Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
          <button
            type="button"
            onClick={() => setAddTaskModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {isFilterOpen ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Filters
            </p>
            <button
              type="button"
              onClick={() =>
                updateFilters({
                  priorities: [],
                  categories: [],
                  tags: [],
                  preset,
                })
              }
              className="text-xs font-medium text-sky-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-medium text-slate-700">Priority</p>
              <div className="flex flex-wrap gap-2">
                {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => {
                  const selected = filters.priorities.includes(priority)
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() =>
                        toggleMultiSelect(filters.priorities, priority, 'priorities')
                      }
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
                      onClick={() =>
                        toggleMultiSelect(filters.categories, category, 'categories')
                      }
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
                      onClick={() => toggleMultiSelect(filters.tags, tag, 'tags')}
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
      ) : null}

      {activeFilterCount > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {filters.priorities.map((priority) => (
            <button
              key={`chip-priority-${priority}`}
              type="button"
              onClick={() => toggleMultiSelect(filters.priorities, priority, 'priorities')}
              className="rounded-full bg-slate-900 px-2 py-1 text-xs text-white"
            >
              priority:{priority} x
            </button>
          ))}
          {filters.categories.map((category) => (
            <button
              key={`chip-category-${category}`}
              type="button"
              onClick={() => toggleMultiSelect(filters.categories, category, 'categories')}
              className="rounded-full bg-sky-100 px-2 py-1 text-xs text-sky-900"
            >
              category:{category} x
            </button>
          ))}
          {filters.tags.map((tag) => (
            <button
              key={`chip-tag-${tag}`}
              type="button"
              onClick={() => toggleMultiSelect(filters.tags, tag, 'tags')}
              className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-900"
            >
              tag:#{tag} x
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_auto_auto]">
        <input
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value, preset })}
          placeholder="Search tasks by title or description"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
          <CalendarClock size={16} />
          Sort
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as TaskSortKey)}
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
              onClick={() => setCurrentViewMode(mode)}
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
    </header>
  )
}
