import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  normalizeTaskFormValues,
  taskFormSchema,
  type TaskFormValues,
} from '../../lib/validation/taskFormSchema'
import type { Task } from '../../types'
import { TaskFormFields } from './TaskFormFields'
import { mapTaskToFormValues } from './taskFormMappers'

interface EditTaskFormProps {
  task: Task
  onSubmitTask: (taskId: string, values: TaskFormValues) => void
  onDeleteTask: (taskId: string) => void
}

export function EditTaskForm({ task, onSubmitTask, onDeleteTask }: EditTaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: mapTaskToFormValues(task),
  })

  useEffect(() => {
    reset(mapTaskToFormValues(task))
  }, [task, reset])

  const handleFormSubmit = (values: TaskFormValues) => {
    onSubmitTask(task.id, values)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4">
      <TaskFormFields register={register} errors={errors} />

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
        >
          Delete task
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Save changes
        </button>
      </div>
    </form>
  )
}

export const normalizeEditValues = normalizeTaskFormValues
