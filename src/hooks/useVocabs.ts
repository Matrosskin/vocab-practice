import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "./store"
import { getDatabase, onValue, ref } from "firebase/database"
import { useBusy } from './useBusy'

export interface IVocab {
  id: string,
  name: string,
  isDefault?: boolean,
}

export const useVocabs = () => {
  const [vocabs, setVocabs] = useState<IVocab[]>([])
  const uid = useAppSelector((state) => state.user.user?.uid)
  const [, setIsBusy] = useBusy()
  const isFirstTimeRef = useRef<boolean>(true)

  useEffect(() => {
    setIsBusy(true)
  }, [setIsBusy])

  useEffect(() => {
    if (!uid) return

    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
    return onValue(vocabListRef, (allVocabsSnapshot) => {
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
          isDefault: val.isDefault,
        })
      })
      setVocabs(temporaryVocabs)
    })
  }, [setIsBusy, uid])

  return vocabs
}
