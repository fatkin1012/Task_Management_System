import { create } from 'zustand'

import type { CalendarConnectionState, TaskViewMode } from '../types'

interface UiState {
  currentViewMode: TaskViewMode
  isTaskDrawerOpen: boolean
  isAddTaskModalOpen: boolean
  calendarConnection: CalendarConnectionState
  setCurrentViewMode: (mode: TaskViewMode) => void
  setTaskDrawerOpen: (open: boolean) => void
  setAddTaskModalOpen: (open: boolean) => void
  setCalendarConnection: (connection: CalendarConnectionState) => void
}

export const useUiStore = create<UiState>((set) => ({
  currentViewMode: 'list',
  isTaskDrawerOpen: false,
  isAddTaskModalOpen: false,
  calendarConnection: {
    connected: false,
    provider: null,
    accountEmail: null,
  },
  setCurrentViewMode: (mode) => set({ currentViewMode: mode }),
  setTaskDrawerOpen: (open) => set({ isTaskDrawerOpen: open }),
  setAddTaskModalOpen: (open) => set({ isAddTaskModalOpen: open }),
  setCalendarConnection: (connection) => set({ calendarConnection: connection }),
}))
