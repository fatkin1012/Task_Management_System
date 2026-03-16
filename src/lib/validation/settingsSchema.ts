import { z } from 'zod'

export const settingsSchema = z.object({
  useMock: z.boolean(),
  clientId: z.string().trim(),
  apiKey: z.string().trim(),
  discoveryDoc: z.string().trim().min(1, 'Discovery doc is required'),
  scopes: z.string().trim().min(1, 'Scopes are required'),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>

export interface ApiPair {
  key: string
  value: string
}
