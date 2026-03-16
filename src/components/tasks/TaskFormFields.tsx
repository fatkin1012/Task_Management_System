import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import {
  taskPriorityOptions,
  taskStatusOptions,
  type TaskFormValues,
} from '../../lib/validation/taskFormSchema'

interface TaskFormFieldsProps {
  register: UseFormRegister<TaskFormValues>
  errors: FieldErrors<TaskFormValues>
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="mt-1 text-xs text-rose-600">{message}</p>
}

export function TaskFormFields({ register, errors }: TaskFormFieldsProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-slate-700">Title</label>
        <input
          {...register('title')}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="Write task title"
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="Add context for this task"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            {taskStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <select
            {...register('priority')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            {taskPriorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Due date</label>
          <input
            type="date"
            {...register('dueDate')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Due time</label>
          <input
            type="time"
            {...register('dueTime')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Duration (minutes)</label>
          <input
            type="number"
            min={0}
            step={5}
            {...register('estimatedDurationMinutes', { valueAsNumber: true })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Category / Inbox</label>
          <input
            {...register('category')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Inbox"
          />
          <FieldError message={errors.category?.message} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Project</label>
        <input
          {...register('projectId')}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="Website Launch"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Tags (comma separated)</label>
        <input
          {...register('tags')}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="launch, marketing"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Reminder (ISO datetime)</label>
        <input
          {...register('reminder')}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="2026-03-15T09:30:00"
        />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register('pinned')} className="size-4 rounded" />
        Pin this task
      </label>
    </div>
  )
}
