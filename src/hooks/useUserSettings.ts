import { useEffect, useRef, useState } from 'react'
import { useUid } from './useUid'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useBusy } from './useBusy'

interface IUserSettings {
  defaultVocabId?: string
}

export const useUserSettings = () => {
  const uid = useUid()
  const [userSettings, setUserSettings] = useState<IUserSettings>({})
  const isFirstTimeRef = useRef<boolean>(true)
  const [, setIsBusy] = useBusy()

  useEffect(() => {
    setIsBusy(true)
  }, [setIsBusy])

  useEffect(() => {
    if (!uid) {
      setUserSettings({})
      return
    }

    const db = getDatabase()
    const settingsRef = ref(db, `v-p-app-v1/users/${uid}/settings`)
    return onValue(settingsRef, (settingsSnapshot) => {
      if (isFirstTimeRef.current) {
        setIsBusy(false)
        isFirstTimeRef.current = false
      }

      setUserSettings(settingsSnapshot.val() || {})
    })
  }, [setIsBusy, uid])

  return userSettings
}
