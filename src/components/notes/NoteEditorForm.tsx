import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { Note, Task } from '../../types'

const noteEditorSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  content: z.string().trim().min(1, 'Content is required').max(6000),
  links: z.string().optional(),
  linkedTaskId: z.string().optional(),
})

type NoteEditorFormValues = z.infer<typeof noteEditorSchema>

interface NoteEditorFormProps {
  selectedNote: Note | null
  tasks: Task[]
  onCreate: (input: {
    title: string
    content: string
    links: string[]
    linkedTaskId: string | null
    templateId: string | null
  }) => void
  onUpdate: (
    noteId: string,
    patch: {
      title: string
      content: string
      links: string[]
      linkedTaskId: string | null
      templateId: string | null
    },
  ) => void
}

const mapNoteToValues = (note: Note | null): NoteEditorFormValues => ({
  title: note?.title ?? '',
  content: note?.content ?? '',
  links: note?.links.join(', ') ?? '',
  linkedTaskId: note?.linkedTaskId ?? '',
})

export function NoteEditorForm({ selectedNote, tasks, onCreate, onUpdate }: NoteEditorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NoteEditorFormValues>({
    resolver: zodResolver(noteEditorSchema),
    defaultValues: mapNoteToValues(selectedNote),
  })

  useEffect(() => {
    reset(mapNoteToValues(selectedNote))
  }, [reset, selectedNote])

  const onSubmit = (values: NoteEditorFormValues) => {
    const normalized = {
      title: values.title.trim(),
      content: values.content.trim(),
      links: (values.links ?? '')
        .split(',')
        .map((link) => link.trim())
        .filter(Boolean),
      linkedTaskId: values.linkedTaskId && values.linkedTaskId.length > 0 ? values.linkedTaskId : null,
      templateId: null,
    }

    if (selectedNote) {
      onUpdate(selectedNote.id, normalized)
      return
    }

    onCreate(normalized)
    reset(mapNoteToValues(null))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{selectedNote ? 'Edit note' : 'Create note'}</h2>
        {selectedNote ? (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Updating</span>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Title</label>
        <input
          {...register('title')}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="Meeting summary"
        />
        {errors.title?.message ? <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Content</label>
        <textarea
          {...register('content')}
          rows={8}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          placeholder="Write key decisions, references, and checklist details"
        />
        {errors.content?.message ? (
          <p className="mt-1 text-xs text-rose-600">{errors.content.message}</p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Useful links (comma separated)</label>
          <input
            {...register('links')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="https://doc-1, https://doc-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Attach to task</label>
          <select
            {...register('linkedTaskId')}
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
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {selectedNote ? 'Save note' : 'Create note'}
      </button>
    </form>
  )
}