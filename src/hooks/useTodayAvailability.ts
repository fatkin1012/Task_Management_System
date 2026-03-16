import { differenceInMinutes, format, parseISO, set } from 'date-fns'
import { useMemo } from 'react'

import { useUiStore } from '../store/uiStore'
import { useTodayEventsQuery } from './useTodayEventsQuery'

const DAY_START_HOUR = 8
const DAY_END_HOUR = 18

export const useTodayAvailability = () => {
  const calendarConnection = useUiStore((state) => state.calendarConnection)
  const { data = [], isLoading } = useTodayEventsQuery(calendarConnection.connected)

  return useMemo(() => {
    const workingStart = set(new Date(), { hours: DAY_START_HOUR, minutes: 0, seconds: 0, milliseconds: 0 })
    const workingEnd = set(new Date(), { hours: DAY_END_HOUR, minutes: 0, seconds: 0, milliseconds: 0 })

    const busyMinutes = data.reduce((total, event) => {
      return total + differenceInMinutes(parseISO(event.end), parseISO(event.start))
    }, 0)
    const totalWorkingMinutes = differenceInMinutes(workingEnd, workingStart)
    const freeMinutes = Math.max(totalWorkingMinutes - busyMinutes, 0)

    const sortedEvents = [...data].sort((left, right) => left.start.localeCompare(right.start))
    let nextFreeBlockLabel: string | null = null

    if (sortedEvents.length === 0) {
      nextFreeBlockLabel = `${format(workingStart, 'p')} - ${format(workingEnd, 'p')}`
    } else {
      let cursor = workingStart
      for (const event of sortedEvents) {
        const eventStart = parseISO(event.start)
        if (cursor < eventStart) {
          nextFreeBlockLabel = `${format(cursor, 'p')} - ${format(eventStart, 'p')}`
          break
        }
        const eventEnd = parseISO(event.end)
        if (eventEnd > cursor) {
          cursor = eventEnd
        }
      }

      if (!nextFreeBlockLabel && cursor < workingEnd) {
        nextFreeBlockLabel = `${format(cursor, 'p')} - ${format(workingEnd, 'p')}`
      }
    }

    return {
      connected: calendarConnection.connected,
      isLoading,
      eventCount: data.length,
      busyMinutes,
      freeMinutes,
      nextFreeBlockLabel,
    }
  }, [calendarConnection.connected, data, isLoading])
}