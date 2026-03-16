import { create } from 'zustand'
import { formatISO } from 'date-fns'

import {
  buildDuplicatedTask,
  buildTaskFromFormInput,
  moveTaskInCollection,
  removeTaskFromCollection,
  resequenceTasks,
  type TaskUpdatePatch,
  toggleTaskCompletionInCollection,
  updateTaskCollection,
} from '../features/tasks/domain/taskDomainService'
import { taskRepository } from '../services/localStorageTaskRepository'
import type { Task, TaskFilters, TaskSortKey, TaskStatus } from '../types'
import type { NormalizedTaskFormValues } from '../lib/validation/taskFormSchema'

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
  duplicateTask: (taskId: string) => void
  updateTask: (taskId: string, patch: TaskUpdatePatch) => void
  deleteTask: (taskId: string) => void
  toggleTaskCompletion: (taskId: string) => void
  moveTask: (taskId: string, nextStatus: TaskStatus, overTaskId?: string | null) => void
}

const defaultFilters: TaskFilters = {
  preset: 'inbox',
  statuses: [],
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
    const newTask = buildTaskFromFormInput(input, nowIso)

    set((state) => ({
      tasks: resequenceTasks([newTask, ...state.tasks]),
      selectedTaskId: newTask.id,
    }))
  },
  duplicateTask: (taskId) => {
    const nowIso = formatISO(new Date())
    set((state) => {
      const sourceTask = state.tasks.find((task) => task.id === taskId)
      if (!sourceTask) {
        return state
      }

      const duplicatedTask = buildDuplicatedTask(sourceTask, nowIso)

      return {
        tasks: resequenceTasks([duplicatedTask, ...state.tasks]),
        selectedTaskId: duplicatedTask.id,
      }
    })
  },
  updateTask: (taskId, patch) => {
    const nowIso = formatISO(new Date())
    set((state) => ({
      tasks: updateTaskCollection(state.tasks, taskId, patch, nowIso),
    }))
  },
  deleteTask: (taskId) => {
    set((state) => ({
      tasks: removeTaskFromCollection(state.tasks, taskId),
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
    }))
  },
  toggleTaskCompletion: (taskId) => {
    const nowIso = formatISO(new Date())
    set((state) => ({
      tasks: toggleTaskCompletionInCollection(state.tasks, taskId, nowIso),
    }))
  },
  moveTask: (taskId, nextStatus, overTaskId) => {
    const nowIso = formatISO(new Date())
    set((state) => {
      const nextTasks = moveTaskInCollection(state.tasks, taskId, nextStatus, nowIso, overTaskId)
      return { tasks: nextTasks }
    })
  },
}))
