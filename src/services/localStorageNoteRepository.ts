import { safeLocalStorage } from '../lib/storage'
import type { Note } from '../types'
import type { NoteRepository } from '../repositories/noteRepository'

const NOTES_STORAGE_KEY = 'task-planner.notes.v1'

const normalizeNote = (note: Partial<Note>, index: number): Note => ({
  id: note.id ?? `note-${index + 1}`,
  title: note.title ?? 'Untitled note',
  content: note.content ?? '',
  links: note.links ?? [],
  templateId: note.templateId ?? null,
  linkedTaskId: note.linkedTaskId ?? null,
  createdAt: note.createdAt ?? new Date().toISOString(),
  updatedAt: note.updatedAt ?? note.createdAt ?? new Date().toISOString(),
})

const normalizeNotes = (notes: Partial<Note>[]) => notes.map(normalizeNote)

export class LocalStorageNoteRepository implements NoteRepository {
  async list(): Promise<Note[]> {
    const raw = safeLocalStorage.getItem(NOTES_STORAGE_KEY)
    if (!raw) {
      return []
    }

    try {
      const parsed = JSON.parse(raw) as Partial<Note>[]
      return normalizeNotes(parsed)
    } catch {
      return []
    }
  }

  async save(notes: Note[]): Promise<void> {
    safeLocalStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(normalizeNotes(notes)))
  }
}

export const noteRepository: NoteRepository = new LocalStorageNoteRepository()