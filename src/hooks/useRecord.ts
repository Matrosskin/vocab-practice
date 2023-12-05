import { useEffect, useRef, useState } from 'react'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useBusy } from './useBusy'
import { useUid } from './useUid'
import { IRecord } from '../interfaces/IRecord'

export const useRecord = (vocabId: string, recordId?: string) => {
  const [record, setRecord] = useState<IRecord | null>()
  const uid = useUid()
  const { setIsBusy } = useBusy()
  const isFirstTimeRef = useRef<boolean>(true)

  useEffect(() => {
    if (!isFirstTimeRef.current) return

    setIsBusy(true)

    return () => setIsBusy(false)
  }, [setIsBusy])

  useEffect(() => {
    if (!uid || !vocabId || !recordId) {
      setRecord(null)
      if (isFirstTimeRef.current) {
        setIsBusy(false)
        isFirstTimeRef.current = false
      }
      return
    }

    const db = getDatabase()
    const recordRef = ref(db, `v-p-app-v1/users/${uid}/records/${vocabId}/${recordId}`)
    return onValue(
      recordRef,
      (recordSnapshot) => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }

        if (!recordSnapshot.exists()) {
          setRecord(null)
          return
        }

        const val: Omit<IRecord, 'id'> = recordSnapshot.val()
        setRecord({
          id: recordSnapshot.key!,
          word: val.word,
          translation: val.translation,
          description: val.description,
        })
      },
      () => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }
      }
    )
  }, [recordId, setIsBusy, uid, vocabId])

  return record
}
