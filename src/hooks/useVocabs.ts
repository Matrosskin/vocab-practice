import { useEffect, useRef, useState } from 'react'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useBusy } from './useBusy'
import { useUid } from './useUid'

export interface IVocab {
  id: string
  name: string
}

export const useVocabs = () => {
  const [vocabs, setVocabs] = useState<IVocab[]>([])
  const uid = useUid()
  const [, setIsBusy] = useBusy()
  const isFirstTimeRef = useRef<boolean>(true)

  useEffect(() => {
    if (!isFirstTimeRef.current) return

    setIsBusy(true)

    return () => setIsBusy(false)
  }, [setIsBusy])

  useEffect(() => {
    if (!uid) {
      setVocabs([])
      if (isFirstTimeRef.current) {
        setIsBusy(false)
        isFirstTimeRef.current = false
      }
      return
    }

    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
    return onValue(
      vocabListRef,
      (allVocabsSnapshot) => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }

        let temporaryVocabs: IVocab[] = []
        allVocabsSnapshot.forEach((vocabSnapshot) => {
          const val: Omit<IVocab, 'id'> = vocabSnapshot.val()
          temporaryVocabs.push({
            id: vocabSnapshot.key!,
            name: val.name,
          })
        })
        setVocabs(temporaryVocabs)
      },
      () => {
        if (isFirstTimeRef.current) {
          setIsBusy(false)
          isFirstTimeRef.current = false
        }
      }
    )
  }, [setIsBusy, uid])

  return vocabs
}
