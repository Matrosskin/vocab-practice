import { useEffect } from 'react'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useBusy } from './useBusy'
import { useUid } from './useUid'
import { IVocab } from '../interfaces/IVocab'
import { useAppDispatch } from './store'
import { setVocabs } from '../slices/vocabsSlice'

export const useListenerOfVocabs = () => {
  const uid = useUid()
  const { threeS } = useBusy()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!uid) {
      return
    }

    threeS.start()

    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
    const stopListening = onValue(
      vocabListRef,
      (allVocabsSnapshot) => {
        threeS.stop()

        let temporaryVocabs: IVocab[] = []
        allVocabsSnapshot.forEach((vocabSnapshot) => {
          const val: Omit<IVocab, 'id'> = vocabSnapshot.val()
          temporaryVocabs.push({
            id: vocabSnapshot.key!,
            name: val.name,
          })
        })
        dispatch(setVocabs(temporaryVocabs))
      },
      () => {
        threeS.stop()
      }
    )

    return () => {
      stopListening()
      dispatch(setVocabs([]))
      threeS.reset()
    }
  }, [dispatch, threeS, uid])
}
