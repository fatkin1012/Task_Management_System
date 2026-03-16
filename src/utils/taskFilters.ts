import { endOfDay, isAfter, isBefore, isToday, parseISO, startOfDay } from 'date-fns'

import type { Task, TaskFilters } from '../types'

export const matchesTaskFilters = (task: Task, filters: TaskFilters, now = new Date()) => {
  const due = task.dueDate ? parseISO(task.dueDate) : null

  if (filters.preset === 'today' && (!due || !isToday(due))) {
    return false
  }

  if (filters.preset === 'upcoming' && (!due || !isAfter(due, endOfDay(now)))) {
    return false
  }

  if (
    filters.preset === 'overdue' &&
    (!due || !isBefore(due, startOfDay(now)) || task.status === 'done')
  ) {
    return false
  }

  if (filters.preset === 'completed' && task.status !== 'done') {
    return false
  }

  if (filters.preset === 'incomplete' && task.status === 'done') {
    return false
  }

  if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
    return false
  }

  if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
    return false
  }

  if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
    return false
  }

  if (filters.tags.length > 0 && !filters.tags.some((tag) => task.tags.includes(tag))) {
    return false
  }

  if (filters.search.trim().length > 0) {
    const query = filters.search.toLowerCase().trim()
    const haystack = `${task.title} ${task.description} ${task.category} ${task.projectId ?? ''}`.toLowerCase()
    if (!haystack.includes(query)) {
      return false
    }
  }

  return true
}