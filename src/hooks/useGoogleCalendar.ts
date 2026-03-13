import { useMutation, useQueryClient } from '@tanstack/react-query'

import { googleCalendarService } from '../services/googleCalendarService'
import { useUiStore } from '../store/uiStore'

export const useConnectGoogleCalendar = () => {
  const setCalendarConnection = useUiStore((state) => state.setCalendarConnection)

  return useMutation({
    mutationFn: () => googleCalendarService.signIn(),
    onSuccess: (connection) => {
      setCalendarConnection(connection)
    },
  })
}

export const useCreateGoogleCalendarEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: googleCalendarService.createEventFromTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['google-calendar', 'today-events'],
      })
    },
  })
}

export const useScheduleSuggestion = () => {
  return useMutation({
    mutationFn: ({
      durationMinutes,
      rangeStart,
      rangeEnd,
    }: {
      durationMinutes: number
      rangeStart: string
      rangeEnd: string
    }) =>
      googleCalendarService.suggestScheduleSlot(
        durationMinutes,
        rangeStart,
        rangeEnd,
      ),
  })
}
