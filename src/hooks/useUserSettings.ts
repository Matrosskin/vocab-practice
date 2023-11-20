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
    if (!isFirstTimeRef.current) return

    setIsBusy(true)

    return () => setIsBusy(false)
  }, [setIsBusy])

  useEffect(() => {
    if (!uid) {
      setUserSettings({})
      if (isFirstTimeRef.current) {
        setIsBusy(false)
        isFirstTimeRef.current = false
      }
      return
    }

    const db = getDatabase()
    const settingsRef = ref(db, `v-p-app-v1/users/${uid}/settings`)
    return onValue(
      settingsRef,
      (settingsSnapshot) => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }

        setUserSettings(settingsSnapshot.val() || {})
      },
      () => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }
      }
    )
  }, [setIsBusy, uid])

  return userSettings
}
