import { formatISO } from 'date-fns'
import { create } from 'zustand'

import type { Note } from '../types'
import { noteRepository } from '../services/localStorageNoteRepository'

interface NoteState {
  notes: Note[]
  isLoaded: boolean
  isLoading: boolean
  selectedNoteId: string | null
  loadNotes: () => Promise<void>
  persistNotes: () => Promise<void>
  setSelectedNoteId: (noteId: string | null) => void
  addNote: (input: Pick<Note, 'title' | 'content' | 'links' | 'linkedTaskId' | 'templateId'>) => void
  updateNote: (
    noteId: string,
    patch: Partial<Pick<Note, 'title' | 'content' | 'links' | 'linkedTaskId' | 'templateId'>>,
  ) => void
  deleteNote: (noteId: string) => void
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoaded: false,
  isLoading: false,
  selectedNoteId: null,
  loadNotes: async () => {
    if (get().isLoaded || get().isLoading) {
      return
    }

    set({ isLoading: true })
    const notes = await noteRepository.list()
    set({ notes, isLoaded: true, isLoading: false })
  },
  persistNotes: async () => {
    await noteRepository.save(get().notes)
  },
  setSelectedNoteId: (noteId) => set({ selectedNoteId: noteId }),
  addNote: (input) => {
    const nowIso = formatISO(new Date())
    const noteId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `note-${Date.now()}`

    const note: Note = {
      id: noteId,
      title: input.title,
      content: input.content,
      links: input.links,
      linkedTaskId: input.linkedTaskId,
      templateId: input.templateId,
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    set((state) => ({ notes: [note, ...state.notes], selectedNoteId: note.id }))
  },
  updateNote: (noteId, patch) => {
    const nowIso = formatISO(new Date())
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              ...patch,
              updatedAt: nowIso,
            }
          : note,
      ),
    }))
  },
  deleteNote: (noteId) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== noteId),
      selectedNoteId: state.selectedNoteId === noteId ? null : state.selectedNoteId,
    }))
  },
}))