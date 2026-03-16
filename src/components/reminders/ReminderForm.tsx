import { zodResolver } from '@hookform/resolvers/zod'
import { formatISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { Note, Task } from '../../types'

const reminderFormSchema = z.object({
  taskId: z.string().optional(),
  noteId: z.string().optional(),
  remindAt: z.string().min(1, 'Reminder time is required'),
  message: z.string().trim().min(1, 'Message is required').max(280),
})

type ReminderFormValues = z.infer<typeof reminderFormSchema>

interface ReminderFormProps {
  tasks: Task[]
  notes: Note[]
  onCreate: (input: { taskId: string | null; noteId: string | null; remindAt: string; message: string }) => void
}

export function ReminderForm({ tasks, notes, onCreate }: ReminderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      taskId: '',
      noteId: '',
      remindAt: formatISO(new Date(), { representation: 'complete' }).slice(0, 16),
      message: '',
    },
  })

  const onSubmit = (values: ReminderFormValues) => {
    onCreate({
      taskId: values.taskId && values.taskId.length > 0 ? values.taskId : null,
      noteId: values.noteId && values.noteId.length > 0 ? values.noteId : null,
      remindAt: new Date(values.remindAt).toISOString(),
      message: values.message.trim(),
    })

    reset({
      taskId: '',
      noteId: '',
      remindAt: formatISO(new Date(), { representation: 'complete' }).slice(0, 16),
      message: '',
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Create reminder</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Task</label>
          <select
            {...register('taskId')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="">No task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Note</label>
          <select
            {...register('noteId')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="">No note</option>
            {notes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Reminder time</label>
        <input
          type="datetime-local"
          {...register('remindAt')}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        {errors.remindAt?.message ? <p className="mt-1 text-xs text-rose-600">{errors.remindAt.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Message</label>
        <input
          {...register('message')}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="Prepare draft before client call"
        />
        {errors.message?.message ? <p className="mt-1 text-xs text-rose-600">{errors.message.message}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        Add reminder
      </button>
    </form>
  )
}