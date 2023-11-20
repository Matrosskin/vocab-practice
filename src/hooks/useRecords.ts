import { useEffect, useRef, useState } from 'react'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useBusy } from './useBusy'
import { useUid } from './useUid'
import { IRecord } from '../interfaces/IRecord'

export const useRecords = (vocabId?: string) => {
  const [records, setRecords] = useState<IRecord[]>([])
  const uid = useUid()
  const [, setIsBusy] = useBusy()
  const isFirstTimeRef = useRef<boolean>(true)

  useEffect(() => {
    if (!isFirstTimeRef.current) return

    setIsBusy(true)

    return () => setIsBusy(false)
  }, [setIsBusy])

  useEffect(() => {
    if (!uid || !vocabId) {
      setRecords([])
      if (isFirstTimeRef.current) {
        setIsBusy(false)
        isFirstTimeRef.current = false
      }
      return
    }

    const db = getDatabase()
    const recordListRef = ref(db, `v-p-app-v1/users/${uid}/records/vocab-${vocabId}`)
    return onValue(
      recordListRef,
      (allVocabRecordsSnapshot) => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }

        let temporaryRecords: IRecord[] = []
        allVocabRecordsSnapshot.forEach((recordSnapshot) => {
          const val: Omit<IRecord, 'id'> = recordSnapshot.val()
          temporaryRecords.push({
            id: recordSnapshot.key!,
            word: val.word,
            translation: val.translation,
            description: val.description,
          })
        })
        setRecords(temporaryRecords)
      },
      () => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }
      }
    )
  }, [setIsBusy, uid, vocabId])

  return records
}
