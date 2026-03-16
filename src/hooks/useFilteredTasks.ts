import { useMemo } from 'react'

import { useTaskStore } from '../store/taskStore'
import { matchesTaskFilters } from '../utils/taskFilters'
import { sortTasks } from '../utils/taskSort'

export const useFilteredTasks = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const filters = useTaskStore((state) => state.filters)
  const sortKey = useTaskStore((state) => state.sortKey)

  return useMemo(() => sortTasks(tasks.filter((task) => matchesTaskFilters(task, filters)), sortKey), [filters, sortKey, tasks])
}
