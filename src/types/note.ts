export interface NoteTemplate {
  id: string
  title: string
  content: string
  category: 'meeting' | 'sop' | 'checklist' | 'scratchpad'
}

export interface Note {
  id: string
  title: string
  content: string
  links: string[]
  templateId: string | null
  linkedTaskId: string | null
  createdAt: string
  updatedAt: string
}