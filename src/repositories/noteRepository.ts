import type { Note } from '../types'

export interface NoteRepository {
  list(): Promise<Note[]>
  save(notes: Note[]): Promise<void>
}