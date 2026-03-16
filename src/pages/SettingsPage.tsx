import { ExtraApiKeysSection } from '../components/settings/ExtraApiKeysSection'
import { GoogleCalendarSettingsSection } from '../components/settings/GoogleCalendarSettingsSection'
import { SettingsPageHeader } from '../components/settings/SettingsPageHeader'
import { SettingsSaveBar } from '../components/settings/SettingsSaveBar'
import { useSettingsForm } from '../hooks/useSettingsForm'

export function SettingsPage() {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    apiPairs,
    message,
    addPair,
    removePair,
    updatePair,
    onSubmit,
  } = useSettingsForm()

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-5 py-10 md:px-8 md:py-14">
      <SettingsPageHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <GoogleCalendarSettingsSection register={register} errors={errors} />
        <ExtraApiKeysSection
          apiPairs={apiPairs}
          onAddPair={addPair}
          onRemovePair={removePair}
          onUpdatePair={updatePair}
        />
        <SettingsSaveBar message={message} isSubmitting={isSubmitting} />
      </form>
    </main>
  )
}
