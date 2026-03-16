import { formatISO } from 'date-fns'
import { create } from 'zustand'

import type { FocusSession, FocusSessionMode } from '../types'
import { focusSessionRepository } from '../services/localStorageFocusSessionRepository'

interface FocusState {
  sessions: FocusSession[]
  isLoaded: boolean
  isLoading: boolean
  activeSessionId: string | null
  loadSessions: () => Promise<void>
  persistSessions: () => Promise<void>
  startSession: (input: {
    taskId: string | null
    mode: FocusSessionMode
    durationMinutes: number
    breakDurationMinutes: number
  }) => void
  stopSession: (completed: boolean) => void
}

export const useFocusStore = create<FocusState>((set, get) => ({
  sessions: [],
  isLoaded: false,
  isLoading: false,
  activeSessionId: null,
  loadSessions: async () => {
    if (get().isLoaded || get().isLoading) {
      return
    }

    set({ isLoading: true })
    const sessions = await focusSessionRepository.list()
    set({ sessions, isLoaded: true, isLoading: false })
  },
  persistSessions: async () => {
    await focusSessionRepository.save(get().sessions)
  },
  startSession: (input) => {
    const nowIso = formatISO(new Date())
    const sessionId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `focus-session-${Date.now()}`

    const session: FocusSession = {
      id: sessionId,
      taskId: input.taskId,
      mode: input.mode,
      durationMinutes: input.durationMinutes,
      breakDurationMinutes: input.breakDurationMinutes,
      startedAt: nowIso,
      endedAt: null,
      completed: false,
      createdAt: nowIso,
    }

    set((state) => ({ sessions: [session, ...state.sessions], activeSessionId: session.id }))
  },
  stopSession: (completed) => {
    const nowIso = formatISO(new Date())
    const activeId = get().activeSessionId
    if (!activeId) {
      return
    }

    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === activeId
          ? {
              ...session,
              completed,
              endedAt: nowIso,
            }
          : session,
      ),
      activeSessionId: null,
    }))
  },
}))