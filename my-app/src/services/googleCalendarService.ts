import { addMinutes, formatISO } from 'date-fns'

import type {
  CalendarConnectionState,
  CalendarEvent,
  FreeBusySlot,
  MapTaskToEventInput,
  ScheduleSuggestion,
} from '../types'
import { appSettingsService } from './appSettingsService'
import { MockGoogleCalendarService } from './mockGoogleCalendarService'

export interface GoogleCalendarService {
  signIn(): Promise<CalendarConnectionState>
  listTodayEvents(): Promise<CalendarEvent[]>
  createEventFromTask(input: MapTaskToEventInput): Promise<CalendarEvent>
  getFreeBusy(start: string, end: string): Promise<FreeBusySlot[]>
  suggestScheduleSlot(
    durationMinutes: number,
    rangeStart: string,
    rangeEnd: string,
  ): Promise<ScheduleSuggestion | null>
}

interface GoogleCalendarConfig {
  clientId?: string
  apiKey?: string
  discoveryDoc?: string
  scopes?: string
  useMock?: boolean
}

// Browser-based JavaScript integration pattern (GIS + gapi) with a mock fallback.
// TODO: Fill GOOGLE_CLIENT_ID and GOOGLE_API_KEY in .env to enable real auth + API calls.
class BrowserGoogleCalendarService implements GoogleCalendarService {
  private readonly fallbackService: GoogleCalendarService

  constructor(fallbackService: GoogleCalendarService) {
    this.fallbackService = fallbackService
  }

  private get config(): GoogleCalendarConfig {
    const settings = appSettingsService.getSettings()
    return {
      clientId: settings.googleCalendar.clientId,
      apiKey: settings.googleCalendar.apiKey,
      discoveryDoc: settings.googleCalendar.discoveryDoc,
      scopes: settings.googleCalendar.scopes,
      useMock: settings.googleCalendar.useMock,
    }
  }

  private isMockMode() {
    return (
      this.config.useMock === true ||
      !this.config.clientId ||
      !this.config.apiKey
    )
  }

  async signIn(): Promise<CalendarConnectionState> {
    if (this.isMockMode()) {
      return this.fallbackService.signIn()
    }

    // TODO: Real browser OAuth implementation:
    // 1) Load Google Identity Services script and request token for this.config.scopes.
    // 2) Load gapi client with this.config.apiKey and this.config.discoveryDoc.
    // 3) Return authenticated account information.
    return {
      connected: true,
      provider: 'google',
      accountEmail: 'oauth-user@gmail.com',
    }
  }

  async listTodayEvents(): Promise<CalendarEvent[]> {
    if (this.isMockMode()) {
      return this.fallbackService.listTodayEvents()
    }

    // TODO: Use gapi.client.calendar.events.list for today's time range.
    return []
  }

  async createEventFromTask(input: MapTaskToEventInput): Promise<CalendarEvent> {
    if (this.isMockMode()) {
      return this.fallbackService.createEventFromTask(input)
    }

    // TODO: Use gapi.client.calendar.events.insert to create event in primary calendar.
    const start = input.preferredStart ?? formatISO(new Date())
    const end = formatISO(addMinutes(new Date(start), input.task.estimatedDurationMinutes))

    return {
      id: `google-live-${input.task.id}`,
      title: input.task.title,
      description: input.task.description,
      start,
      end,
      source: 'google',
    }
  }

  async getFreeBusy(start: string, end: string): Promise<FreeBusySlot[]> {
    if (this.isMockMode()) {
      return this.fallbackService.getFreeBusy(start, end)
    }

    // TODO: Use gapi.client.calendar.freebusy.query with date range and primary calendar.
    return []
  }

  async suggestScheduleSlot(
    durationMinutes: number,
    rangeStart: string,
    rangeEnd: string,
  ): Promise<ScheduleSuggestion | null> {
    const slots = await this.getFreeBusy(rangeStart, rangeEnd)
    const requiredSlots = Math.max(1, Math.ceil(durationMinutes / 30))

    for (let index = 0; index <= slots.length - requiredSlots; index += 1) {
      const segment = slots.slice(index, index + requiredSlots)
      if (segment.every((slot) => !slot.isBusy)) {
        return {
          start: segment[0].start,
          end: segment[segment.length - 1].end,
          reason: 'Available free/busy slot from Google Calendar.',
        }
      }
    }

    return null
  }
}

export const googleCalendarService: GoogleCalendarService = new BrowserGoogleCalendarService(
  new MockGoogleCalendarService(),
)

// TODO: Google Calendar watch/push sync is backend-only and requires a webhook endpoint.
