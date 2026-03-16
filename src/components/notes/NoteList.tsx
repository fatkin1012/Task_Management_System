import { format, parseISO } from 'date-fns'

import type { Note, Task } from '../../types'

interface NoteListProps {
  notes: Note[]
  tasks: Task[]
  selectedNoteId: string | null
  onSelect: (noteId: string) => void
  onDelete: (noteId: string) => void
}

export function NoteList({ notes, tasks, selectedNoteId, onSelect, onDelete }: NoteListProps) {
  const taskLookup = new Map(tasks.map((task) => [task.id, task.title]))

  if (notes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No notes yet. Create your first meeting note or SOP snippet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <article
          key={note.id}
          className={`rounded-2xl bg-white p-4 shadow-sm ring-1 transition ${
            selectedNoteId === note.id ? 'ring-slate-900' : 'ring-slate-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <button type="button" onClick={() => onSelect(note.id)} className="min-w-0 text-left">
              <p className="truncate text-base font-semibold text-slate-900">{note.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{note.content}</p>
            </button>
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              Delete
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{format(parseISO(note.updatedAt), 'MMM d, p')}</span>
            {note.linkedTaskId ? (
              <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">
                Task: {taskLookup.get(note.linkedTaskId) ?? 'Unknown'}
              </span>
            ) : null}
            {note.links.length > 0 ? (
              <span className="rounded-full bg-violet-50 px-2 py-1 text-violet-700">
                {note.links.length} links
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}