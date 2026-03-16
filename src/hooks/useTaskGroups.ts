import { useMemo } from 'react'

import type { Task } from '../types'
import { useUiStore } from '../store/uiStore'

export interface TaskGroup {
  id: string
  label: string
  tasks: Task[]
}

export const useTaskGroups = (tasks: Task[]) => {
  const taskGroupBy = useUiStore((state) => state.taskGroupBy)

  return useMemo<TaskGroup[]>(() => {
    if (taskGroupBy === 'none') {
      return [
        {
          id: 'all',
          label: 'All tasks',
          tasks,
        },
      ]
    }

    const groups = new Map<string, Task[]>()

    tasks.forEach((task) => {
      const rawLabel = taskGroupBy === 'project' ? task.projectId ?? 'No project' : task.category
      const groupLabel = rawLabel && rawLabel.trim().length > 0 ? rawLabel : 'Uncategorized'
      const existing = groups.get(groupLabel) ?? []
      existing.push(task)
      groups.set(groupLabel, existing)
    })

    return Array.from(groups.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([label, groupedTasks]) => ({
        id: label,
        label,
        tasks: groupedTasks,
      }))
  }, [taskGroupBy, tasks])
}