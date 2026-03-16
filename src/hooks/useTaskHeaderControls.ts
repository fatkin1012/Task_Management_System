import { useMemo, useState } from 'react'

import { useTaskStore } from '../store/taskStore'
import { useUiStore } from '../store/uiStore'
import type { TaskFilterPreset, TaskGroupBy, TaskSortKey, TaskViewMode } from '../types'

export const sortOptions: { label: string; value: TaskSortKey }[] = [
  { label: 'Manual', value: 'manual' },
  { label: 'Due date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Created time', value: 'createdAt' },
  { label: 'Status', value: 'status' },
]

export const viewModes: TaskViewMode[] = ['list', 'board', 'calendar']
export const statusOptions = ['todo', 'in_progress', 'waiting', 'blocked', 'done'] as const
export const priorityOptions = ['low', 'medium', 'high', 'urgent'] as const

export const useTaskHeaderControls = (preset: TaskFilterPreset) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filters = useTaskStore((state) => state.filters)
  const updateFilters = useTaskStore((state) => state.updateFilters)
  const sortKey = useTaskStore((state) => state.sortKey)
  const setSortKey = useTaskStore((state) => state.setSortKey)
  const tasks = useTaskStore((state) => state.tasks)

  const currentViewMode = useUiStore((state) => state.currentViewMode)
  const setCurrentViewMode = useUiStore((state) => state.setCurrentViewMode)
  const setAddTaskModalOpen = useUiStore((state) => state.setAddTaskModalOpen)
  const setQuickCaptureOpen = useUiStore((state) => state.setQuickCaptureOpen)
  const taskGroupBy = useUiStore((state) => state.taskGroupBy)
  const setTaskGroupBy = useUiStore((state) => state.setTaskGroupBy)

  const categoryOptions = useMemo(
    () => [...new Set(tasks.map((task) => task.category))].sort(),
    [tasks],
  )

  const tagOptions = useMemo(
    () => [...new Set(tasks.flatMap((task) => task.tags))].sort(),
    [tasks],
  )

  const activeFilterCount =
    filters.statuses.length +
    filters.priorities.length +
    filters.categories.length +
    filters.tags.length

  const toggleMultiSelect = (
    current: string[],
    value: string,
    key: 'statuses' | 'priorities' | 'categories' | 'tags',
  ) => {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]

    updateFilters({ [key]: next, preset })
  }

  const clearAllFilters = () => {
    updateFilters({
      statuses: [],
      priorities: [],
      categories: [],
      tags: [],
      preset,
    })
  }

  const updateSearch = (search: string) => {
    updateFilters({ search, preset })
  }

  return {
    isFilterOpen,
    setIsFilterOpen,
    filters,
    sortKey,
    setSortKey,
    currentViewMode,
    setCurrentViewMode,
    taskGroupBy,
    setTaskGroupBy: (groupBy: TaskGroupBy) => setTaskGroupBy(groupBy),
    setQuickCaptureOpen,
    setAddTaskModalOpen,
    categoryOptions,
    tagOptions,
    activeFilterCount,
    toggleMultiSelect,
    clearAllFilters,
    updateSearch,
  }
}
