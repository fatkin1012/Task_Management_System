import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  normalizeTaskFormValues,
  taskFormSchema,
  type TaskFormValues,
} from '../../lib/validation/taskFormSchema'
import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'
import { TaskFormFields } from './TaskFormFields'
import { defaultTaskFormValues } from './taskFormMappers'

export function AddTaskModal() {
  const isOpen = useUiStore((state) => state.isAddTaskModalOpen)
  const setOpen = useUiStore((state) => state.setAddTaskModalOpen)
  const addTask = useTaskStore((state) => state.addTask)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultTaskFormValues,
  })

  const onSubmit = (values: TaskFormValues) => {
    addTask(normalizeTaskFormValues(values))
    reset(defaultTaskFormValues)
    setOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Add Task</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TaskFormFields register={register} errors={errors} />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
