import { format, parseISO } from 'date-fns'

import { useConnectGoogleCalendar } from '../../hooks/useGoogleCalendar'
import { useTodayEventsQuery } from '../../hooks/useTodayEventsQuery'
import { useUiStore } from '../../store/uiStore'

export function TodayEventsPanel() {
  const calendarConnection = useUiStore((state) => state.calendarConnection)
  const connectMutation = useConnectGoogleCalendar()
  const connected = calendarConnection.connected
  const { data, isLoading } = useTodayEventsQuery(connected)

  return (
    <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Google Calendar (Today)</h3>
        {!connected ? (
          <button
            type="button"
            onClick={() => connectMutation.mutate()}
            disabled={connectMutation.isPending}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {connectMutation.isPending ? 'Connecting...' : 'Connect'}
          </button>
        ) : null}
      </div>
      {connected ? (
        <p className="mt-2 text-xs text-slate-500">Connected: {calendarConnection.accountEmail}</p>
      ) : null}
      {!connected ? (
        <p className="mt-3 text-sm text-slate-500">Connect Google Calendar to view events.</p>
      ) : isLoading ? (
        <p className="mt-3 text-sm text-slate-500">Loading events...</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {data?.length === 0 ? (
            <li className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-xs text-slate-500">
              No events found for today.
            </li>
          ) : null}
          {data?.map((event) => (
            <li key={event.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
              <p className="font-medium text-slate-800">{event.title}</p>
              <p className="text-slate-500">
                {format(parseISO(event.start), 'p')} - {format(parseISO(event.end), 'p')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
