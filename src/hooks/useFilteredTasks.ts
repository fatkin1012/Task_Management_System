import { compareAsc, isAfter, isBefore, isToday, parseISO } from 'date-fns'

import type { Task } from '../types'
import { useTaskStore } from '../store/taskStore'

const priorityRank: Record<Task['priority'], number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export const useFilteredTasks = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const filters = useTaskStore((state) => state.filters)
  const sortKey = useTaskStore((state) => state.sortKey)

  const now = new Date()

  const filtered = tasks.filter((task) => {
    const due = task.dueDate ? parseISO(task.dueDate) : null

    if (filters.preset === 'today' && (!due || !isToday(due))) {
      return false
    }

    if (filters.preset === 'upcoming' && (!due || !isAfter(due, now))) {
      return false
    }

    if (filters.preset === 'overdue' && (!due || !isBefore(due, now) || task.status === 'done')) {
      return false
    }

    if (filters.preset === 'completed' && task.status !== 'done') {
      return false
    }

    if (filters.preset === 'incomplete' && task.status === 'done') {
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
      const haystack = `${task.title} ${task.description}`.toLowerCase()
      if (!haystack.includes(query)) {
        return false
      }
    }

    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'manual') {
      return Number(b.pinned) - Number(a.pinned)
    }

    if (sortKey === 'priority') {
      return priorityRank[b.priority] - priorityRank[a.priority]
    }

    if (sortKey === 'createdAt') {
      return compareAsc(parseISO(b.createdAt), parseISO(a.createdAt))
    }

    if (sortKey === 'status') {
      return a.status.localeCompare(b.status)
    }

    const aDue = a.dueDate ? parseISO(a.dueDate) : new Date(8640000000000000)
    const bDue = b.dueDate ? parseISO(b.dueDate) : new Date(8640000000000000)
    return compareAsc(aDue, bDue)
  })

  return sorted
}
