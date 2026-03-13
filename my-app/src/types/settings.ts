export interface GoogleCalendarRuntimeSettings {
  useMock: boolean
  clientId: string
  apiKey: string
  discoveryDoc: string
  scopes: string
}

export interface AppSettings {
  googleCalendar: GoogleCalendarRuntimeSettings
  extraApis: Record<string, string>
  updatedAt: string | null
}
