import type { PlannerSettings } from '../types'

export interface PlannerSettingsRepository {
  get(): Promise<PlannerSettings>
  save(settings: PlannerSettings): Promise<void>
}