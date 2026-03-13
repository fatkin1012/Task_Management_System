import { useQuery } from '@tanstack/react-query'

import { googleCalendarService } from '../services/googleCalendarService'

export const useTodayEventsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['google-calendar', 'today-events'],
    queryFn: () => googleCalendarService.listTodayEvents(),
    enabled,
  })
}
