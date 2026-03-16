import { formatISO } from 'date-fns'

import { safeLocalStorage } from '../lib/storage'
import type { PlannerSettings } from '../types'
import type { PlannerSettingsRepository } from '../repositories/plannerSettingsRepository'

const PLANNER_SETTINGS_STORAGE_KEY = 'task-planner.settings.planner.v1'

const defaultPlannerSettings: PlannerSettings = {
  dayStartHour: 8,
  dayEndHour: 18,
  defaultFocusMinutes: 25,
  breakMinutes: 5,
  autoSuggestSlots: true,
  updatedAt: null,
}

const mergeWithDefaults = (incoming: Partial<PlannerSettings> | null): PlannerSettings => {
  if (!incoming) {
    return defaultPlannerSettings
  }

  return {
    ...defaultPlannerSettings,
    ...incoming,
  }
}

export class LocalStoragePlannerSettingsRepository implements PlannerSettingsRepository {
  async get(): Promise<PlannerSettings> {
    const raw = safeLocalStorage.getItem(PLANNER_SETTINGS_STORAGE_KEY)
    if (!raw) {
      return defaultPlannerSettings
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PlannerSettings>
      return mergeWithDefaults(parsed)
    } catch {
      return defaultPlannerSettings
    }
  }

  async save(settings: PlannerSettings): Promise<void> {
    const payload: PlannerSettings = {
      ...settings,
      updatedAt: formatISO(new Date()),
    }
    safeLocalStorage.setItem(PLANNER_SETTINGS_STORAGE_KEY, JSON.stringify(payload))
  }
}

export const plannerSettingsRepository: PlannerSettingsRepository =
  new LocalStoragePlannerSettingsRepository()