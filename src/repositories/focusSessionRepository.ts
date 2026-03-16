import type { FocusSession } from '../types'

export interface FocusSessionRepository {
  list(): Promise<FocusSession[]>
  save(sessions: FocusSession[]): Promise<void>
}