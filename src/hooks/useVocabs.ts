import { useEffect, useState } from "react"
import { useAppSelector } from "./store"
import { getDatabase, onChildAdded, onChildChanged, onChildRemoved, ref } from "firebase/database"

interface IVocab {
  id: string,
  name: string,
}

export const useVocabs = () => {
  const [vocabs, setVocabs] = useState<IVocab[]>([])
  const uid = useAppSelector((state) => state.user.user?.uid)

  useEffect(() => {
    if (!uid) return

    let temporaryVocabs: IVocab[] = []
    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
    const stopOnChildAdded = onChildAdded(vocabListRef, (snapshot) => {
      temporaryVocabs = [
        ...temporaryVocabs,
        {
          id: snapshot.key!,
          name: snapshot.val().name as string
        }
      ]
      setVocabs(temporaryVocabs)
    })
    const stopOnChildChanged = onChildChanged(vocabListRef, (snapshot) => {
      temporaryVocabs = temporaryVocabs.map((vocab) => (vocab.id === snapshot.key ? {
        id: snapshot.key!,
        name: snapshot.val().name as string
      } : vocab))
      setVocabs(temporaryVocabs)
    })
    const stopOnChildRemoved = onChildRemoved(vocabListRef, (snapshot) => {
      temporaryVocabs = temporaryVocabs.filter(({id}) => id === snapshot.key)
      setVocabs(temporaryVocabs)
    })

    return () => {
      stopOnChildAdded()
      stopOnChildChanged()
      stopOnChildRemoved()

      setVocabs([])
    }
  }, [uid])

  return vocabs
}
