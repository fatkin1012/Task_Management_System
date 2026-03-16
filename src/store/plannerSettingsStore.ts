import { create } from 'zustand'

import type { PlannerSettings } from '../types'
import { plannerSettingsRepository } from '../services/localStoragePlannerSettingsRepository'

interface PlannerSettingsState {
  settings: PlannerSettings
  isLoaded: boolean
  isLoading: boolean
  loadSettings: () => Promise<void>
  persistSettings: () => Promise<void>
  updateSettings: (patch: Partial<PlannerSettings>) => void
}

const defaultSettings: PlannerSettings = {
  dayStartHour: 8,
  dayEndHour: 18,
  defaultFocusMinutes: 25,
  breakMinutes: 5,
  autoSuggestSlots: true,
  updatedAt: null,
}

export const usePlannerSettingsStore = create<PlannerSettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoaded: false,
  isLoading: false,
  loadSettings: async () => {
    if (get().isLoaded || get().isLoading) {
      return
    }

    set({ isLoading: true })
    const settings = await plannerSettingsRepository.get()
    set({ settings, isLoaded: true, isLoading: false })
  },
  persistSettings: async () => {
    await plannerSettingsRepository.save(get().settings)
  },
  updateSettings: (patch) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...patch,
      },
    }))
  },
}))