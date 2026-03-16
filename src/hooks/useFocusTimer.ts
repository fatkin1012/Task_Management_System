import { differenceInSeconds, parseISO } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

import { useFocusStore } from '../store/focusStore'

export const useFocusTimer = () => {
  const sessions = useFocusStore((state) => state.sessions)
  const activeSessionId = useFocusStore((state) => state.activeSessionId)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (!activeSessionId) {
      return
    }

    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [activeSessionId])

  return useMemo(() => {
    const activeSession = sessions.find((session) => session.id === activeSessionId) ?? null
    if (!activeSession || !activeSession.startedAt) {
      return {
        activeSession: null,
        remainingSeconds: 0,
        elapsedSeconds: 0,
        isComplete: false,
      }
    }

    const elapsedSeconds = Math.max(
      differenceInSeconds(now, parseISO(activeSession.startedAt)),
      0,
    )
    const totalSeconds = activeSession.durationMinutes * 60
    const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0)

    return {
      activeSession,
      remainingSeconds,
      elapsedSeconds,
      isComplete: remainingSeconds === 0,
    }
  }, [activeSessionId, now, sessions])
}