import { useEffect } from 'react'

import { NoteEditorForm } from '../components/notes/NoteEditorForm'
import { NoteList } from '../components/notes/NoteList'
import { ModulePage } from '../components/ui/ModulePage'
import { useNoteStore } from '../store/noteStore'
import { useTaskStore } from '../store/taskStore'

export function NotesPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const notes = useNoteStore((state) => state.notes)
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId)
  const loadNotes = useNoteStore((state) => state.loadNotes)
  const persistNotes = useNoteStore((state) => state.persistNotes)
  const addNote = useNoteStore((state) => state.addNote)
  const updateNote = useNoteStore((state) => state.updateNote)
  const deleteNote = useNoteStore((state) => state.deleteNote)
  const setSelectedNoteId = useNoteStore((state) => state.setSelectedNoteId)
  const isLoaded = useNoteStore((state) => state.isLoaded)

  useEffect(() => {
    void loadNotes()
  }, [loadNotes])

  useEffect(() => {
    if (isLoaded) {
      void persistNotes()
    }
  }, [isLoaded, notes, persistNotes])

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null

  return (
    <ModulePage
      eyebrow="Notes"
      title="Knowledge and support notes"
      description="Store task notes, meeting notes, SOP fragments, quick scratchpad entries, and reusable templates without coupling note persistence directly into task UI."
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <NoteEditorForm selectedNote={selectedNote} tasks={tasks} onCreate={addNote} onUpdate={updateNote} />
        <NoteList
          notes={notes}
          tasks={tasks}
          selectedNoteId={selectedNoteId}
          onSelect={setSelectedNoteId}
          onDelete={deleteNote}
        />
      </div>
    </ModulePage>
  )
}