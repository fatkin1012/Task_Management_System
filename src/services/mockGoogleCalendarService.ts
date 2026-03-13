import { addMinutes, endOfDay, formatISO, set, startOfDay } from 'date-fns'

import type {
  CalendarConnectionState,
  CalendarEvent,
  FreeBusySlot,
  MapTaskToEventInput,
  ScheduleSuggestion,
} from '../types'
import type { GoogleCalendarService } from './googleCalendarService'

const today = new Date()

const mockEvents: CalendarEvent[] = [
  {
    id: 'google-evt-1',
    title: 'Standup Meeting',
    description: 'Engineering daily sync',
    start: formatISO(set(today, { hours: 9, minutes: 30, seconds: 0 })),
    end: formatISO(set(today, { hours: 10, minutes: 0, seconds: 0 })),
    source: 'google',
  },
  {
    id: 'google-evt-2',
    title: 'Client Call',
    description: 'Quarterly planning review',
    start: formatISO(set(today, { hours: 13, minutes: 0, seconds: 0 })),
    end: formatISO(set(today, { hours: 14, minutes: 0, seconds: 0 })),
    source: 'google',
  },
]

export class MockGoogleCalendarService implements GoogleCalendarService {
  async signIn(): Promise<CalendarConnectionState> {
    // TODO: Replace with real OAuth flow using GOOGLE_CLIENT_ID and GOOGLE_API_KEY.
    return {
      connected: true,
      provider: 'google',
      accountEmail: 'demo.user@gmail.com',
    }
  }

  async listTodayEvents(): Promise<CalendarEvent[]> {
    return mockEvents
  }

  async createEventFromTask(input: MapTaskToEventInput): Promise<CalendarEvent> {
    const eventStart =
      input.preferredStart ??
      formatISO(addMinutes(startOfDay(new Date()), 10 * 60), { format: 'extended' })
    const eventEnd = formatISO(
      addMinutes(new Date(eventStart), input.task.estimatedDurationMinutes),
      {
        format: 'extended',
      },
    )

    return {
      id: `google-evt-${input.task.id}`,
      title: input.task.title,
      description: input.task.description,
      start: eventStart,
      end: eventEnd,
      source: 'task-planner',
    }
  }

  async getFreeBusy(start: string, end: string): Promise<FreeBusySlot[]> {
    const startTime = new Date(start)
    const endTime = new Date(end)
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      return []
    }

    const slots: FreeBusySlot[] = []
    let cursor = startTime
    while (cursor < endTime) {
      const next = addMinutes(cursor, 30)
      const isBusy = mockEvents.some((event) => {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)
        return cursor < eventEnd && next > eventStart
      })

      slots.push({
        start: formatISO(cursor),
        end: formatISO(next),
        isBusy,
      })

      cursor = next
    }

    return slots
  }

  async suggestScheduleSlot(
    durationMinutes: number,
    rangeStart: string,
    rangeEnd: string,
  ): Promise<ScheduleSuggestion | null> {
    const slots = await this.getFreeBusy(rangeStart, rangeEnd)
    const requiredSlots = Math.max(1, Math.ceil(durationMinutes / 30))

    for (let i = 0; i <= slots.length - requiredSlots; i += 1) {
      const segment = slots.slice(i, i + requiredSlots)
      if (segment.every((slot) => !slot.isBusy)) {
        return {
          start: segment[0].start,
          end: segment[segment.length - 1].end,
          reason: 'First available uninterrupted block in selected range.',
        }
      }
    }

    return {
      start: formatISO(startOfDay(new Date())),
      end: formatISO(endOfDay(new Date())),
      reason: 'No full free slot found; suggest splitting this task.',
    }
  }
}

export const googleCalendarService = new MockGoogleCalendarService()
