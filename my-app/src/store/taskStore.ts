import { create } from 'zustand'
import { formatISO } from 'date-fns'

import { taskRepository } from '../services/localStorageTaskRepository'
import type { Task, TaskFilters, TaskSortKey, TaskStatus } from '../types'
import type { NormalizedTaskFormValues } from '../lib/validation/taskFormSchema'

type TaskUpdatePatch = Partial<
  NormalizedTaskFormValues & {
    linkedCalendarEventId: string | null
  }
>

interface TaskState {
  tasks: Task[]
  isLoaded: boolean
  isLoading: boolean
  filters: TaskFilters
  sortKey: TaskSortKey
  selectedTaskId: string | null
  loadTasks: () => Promise<void>
  persistTasks: () => Promise<void>
  setTasks: (tasks: Task[]) => void
  setSelectedTaskId: (taskId: string | null) => void
  setSortKey: (key: TaskSortKey) => void
  updateFilters: (patch: Partial<TaskFilters>) => void
  addTask: (input: NormalizedTaskFormValues) => void
  updateTask: (taskId: string, patch: TaskUpdatePatch) => void
  deleteTask: (taskId: string) => void
  toggleTaskCompletion: (taskId: string) => void
  moveTask: (taskId: string, nextStatus: TaskStatus, overTaskId?: string | null) => void
}

const defaultFilters: TaskFilters = {
  preset: 'inbox',
  priorities: [],
  categories: [],
  tags: [],
  search: '',
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoaded: false,
  isLoading: false,
  filters: defaultFilters,
  sortKey: 'manual',
  selectedTaskId: null,
  loadTasks: async () => {
    if (get().isLoaded || get().isLoading) {
      return
    }

    set({ isLoading: true })
    const tasks = await taskRepository.list()
    set({ tasks, isLoaded: true, isLoading: false })
  },
  persistTasks: async () => {
    await taskRepository.save(get().tasks)
  },
  setTasks: (tasks) => set({ tasks }),
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
  setSortKey: (key) => set({ sortKey: key }),
  updateFilters: (patch) =>
    set((state) => ({ filters: { ...state.filters, ...patch } })),
  addTask: (input) => {
    const nowIso = formatISO(new Date())
    const taskId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `task-${Date.now()}`

    const newTask: Task = {
      id: taskId,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      dueTime: input.dueTime,
      estimatedDurationMinutes: input.estimatedDurationMinutes,
      category: input.category,
      tags: input.tags,
      subtasks: [],
      reminder: input.reminder,
      pinned: input.pinned,
      createdAt: nowIso,
      updatedAt: nowIso,
      linkedCalendarEventId: null,
    }

    set((state) => ({
      tasks: [newTask, ...state.tasks],
      selectedTaskId: newTask.id,
    }))
  },
  updateTask: (taskId, patch) => {
    const nowIso = formatISO(new Date())
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...patch,
              updatedAt: nowIso,
            }
          : task,
      ),
    }))
  },
  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
    }))
  },
  toggleTaskCompletion: (taskId) => {
    const nowIso = formatISO(new Date())
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const isDone = task.status === 'done'
        return {
          ...task,
          status: isDone ? 'todo' : 'done',
          updatedAt: nowIso,
        }
      }),
    }))
  },
  moveTask: (taskId, nextStatus, overTaskId) => {
    const nowIso = formatISO(new Date())
    set((state) => {
      const fromIndex = state.tasks.findIndex((task) => task.id === taskId)
      if (fromIndex < 0) {
        return state
      }

      const movingTask = state.tasks[fromIndex]
      const remaining = state.tasks.filter((task) => task.id !== taskId)

      const updatedTask: Task = {
        ...movingTask,
        status: nextStatus,
        updatedAt: nowIso,
      }

      let targetIndex = remaining.length

      if (overTaskId) {
        const overIndex = remaining.findIndex((task) => task.id === overTaskId)
        if (overIndex >= 0) {
          targetIndex = overIndex
        }
      } else {
        const lastSameStatusIndex = remaining.reduce(
          (lastIndex, task, index) => (task.status === nextStatus ? index : lastIndex),
          -1,
        )
        targetIndex = lastSameStatusIndex >= 0 ? lastSameStatusIndex + 1 : remaining.length
      }

      remaining.splice(targetIndex, 0, updatedTask)
      return { tasks: remaining }
    })
  },
}))
