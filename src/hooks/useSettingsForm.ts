import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { settingsSchema, type ApiPair, type SettingsFormValues } from '../lib/validation/settingsSchema'
import { appSettingsService } from '../services/appSettingsService'

export const useSettingsForm = () => {
  const initialSettings = useMemo(() => appSettingsService.getSettings(), [])
  const [message, setMessage] = useState<string | null>(null)
  const [apiPairs, setApiPairs] = useState<ApiPair[]>(
    Object.entries(initialSettings.extraApis).map(([key, value]) => ({ key, value })),
  )

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      useMock: initialSettings.googleCalendar.useMock,
      clientId: initialSettings.googleCalendar.clientId,
      apiKey: initialSettings.googleCalendar.apiKey,
      discoveryDoc: initialSettings.googleCalendar.discoveryDoc,
      scopes: initialSettings.googleCalendar.scopes,
    },
  })

  const updatePair = (index: number, patch: Partial<ApiPair>) => {
    setApiPairs((prev) => prev.map((pair, idx) => (idx === index ? { ...pair, ...patch } : pair)))
  }

  const addPair = () => {
    setApiPairs((prev) => [...prev, { key: '', value: '' }])
  }

  const removePair = (index: number) => {
    setApiPairs((prev) => prev.filter((_, idx) => idx !== index))
  }

  const onSubmit = (values: SettingsFormValues) => {
    const extraApis = apiPairs.reduce<Record<string, string>>((acc, pair) => {
      const key = pair.key.trim()
      const value = pair.value.trim()
      if (key.length > 0 && value.length > 0) {
        acc[key] = value
      }
      return acc
    }, {})

    appSettingsService.saveSettings({
      googleCalendar: {
        useMock: values.useMock,
        clientId: values.clientId,
        apiKey: values.apiKey,
        discoveryDoc: values.discoveryDoc,
        scopes: values.scopes,
      },
      extraApis,
      updatedAt: initialSettings.updatedAt,
    })

    setMessage('Settings saved. Google Calendar connect will now use these values.')
  }

  return {
    form,
    apiPairs,
    message,
    addPair,
    removePair,
    updatePair,
    onSubmit,
  }
}
