import { create } from 'zustand'

import type { CalendarConnectionState, PlannerViewState, TaskGroupBy, TaskViewMode } from '../types'

interface UiState {
  currentViewMode: TaskViewMode
  isTaskDrawerOpen: boolean
  isAddTaskModalOpen: boolean
  isQuickCaptureOpen: boolean
  isReminderCenterOpen: boolean
  isSidebarCollapsed: boolean
  taskGroupBy: TaskGroupBy
  calendarConnection: CalendarConnectionState
  plannerView: PlannerViewState
  setCurrentViewMode: (mode: TaskViewMode) => void
  setTaskDrawerOpen: (open: boolean) => void
  setAddTaskModalOpen: (open: boolean) => void
  setQuickCaptureOpen: (open: boolean) => void
  setReminderCenterOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTaskGroupBy: (groupBy: TaskGroupBy) => void
  setCalendarConnection: (connection: CalendarConnectionState) => void
  setPlannerView: (patch: Partial<PlannerViewState>) => void
}

export const useUiStore = create<UiState>((set) => ({
  currentViewMode: 'list',
  isTaskDrawerOpen: false,
  isAddTaskModalOpen: false,
  isQuickCaptureOpen: false,
  isReminderCenterOpen: false,
  isSidebarCollapsed: false,
  taskGroupBy: 'none',
  calendarConnection: {
    connected: false,
    provider: null,
    accountEmail: null,
  },
  plannerView: {
    range: 'day',
    selectedDate: new Date().toISOString(),
    showTasks: true,
    showEvents: true,
  },
  setCurrentViewMode: (mode) => set({ currentViewMode: mode }),
  setTaskDrawerOpen: (open) => set({ isTaskDrawerOpen: open }),
  setAddTaskModalOpen: (open) => set({ isAddTaskModalOpen: open }),
  setQuickCaptureOpen: (open) => set({ isQuickCaptureOpen: open }),
  setReminderCenterOpen: (open) => set({ isReminderCenterOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setTaskGroupBy: (groupBy) => set({ taskGroupBy: groupBy }),
  setCalendarConnection: (connection) => set({ calendarConnection: connection }),
  setPlannerView: (patch) =>
    set((state) => ({ plannerView: { ...state.plannerView, ...patch } })),
}))
