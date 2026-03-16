import { safeLocalStorage } from '../lib/storage'
import type { FocusSession } from '../types'
import type { FocusSessionRepository } from '../repositories/focusSessionRepository'

const FOCUS_STORAGE_KEY = 'task-planner.focus-sessions.v1'

const normalizeSession = (session: Partial<FocusSession>, index: number): FocusSession => ({
  id: session.id ?? `focus-session-${index + 1}`,
  taskId: session.taskId ?? null,
  mode: session.mode ?? 'pomodoro',
  durationMinutes: session.durationMinutes ?? 25,
  breakDurationMinutes: session.breakDurationMinutes ?? 5,
  startedAt: session.startedAt ?? null,
  endedAt: session.endedAt ?? null,
  completed: session.completed ?? false,
  createdAt: session.createdAt ?? new Date().toISOString(),
})

const normalizeSessions = (sessions: Partial<FocusSession>[]) => sessions.map(normalizeSession)

export class LocalStorageFocusSessionRepository implements FocusSessionRepository {
  async list(): Promise<FocusSession[]> {
    const raw = safeLocalStorage.getItem(FOCUS_STORAGE_KEY)
    if (!raw) {
      return []
    }

    try {
      const parsed = JSON.parse(raw) as Partial<FocusSession>[]
      return normalizeSessions(parsed)
    } catch {
      return []
    }
  }

  async save(sessions: FocusSession[]): Promise<void> {
    safeLocalStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(normalizeSessions(sessions)))
  }
}

export const focusSessionRepository: FocusSessionRepository =
  new LocalStorageFocusSessionRepository()