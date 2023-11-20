import { useEffect, useState } from 'react'
import { useUserSettings } from './useUserSettings'
import { IVocab, useVocabs } from './useVocabs'
import { useParams } from 'react-router-dom'

export const useVocab = () => {
  const vocabs = useVocabs()
  const { defaultVocabId } = useUserSettings()
  const [vocab, setVocab] = useState<IVocab>()
  const { vocabId } = useParams()

  useEffect(() => {
    if (vocabId) {
      setVocab(vocabs.find(({ id }) => id === vocabId))
      return
    }

    if (!defaultVocabId) {
      setVocab(vocabs[0])
      return
    }

    const defaultVocab = vocabs.find(({ id }) => id === defaultVocabId)
    if (defaultVocab) {
      setVocab(defaultVocab)
      return
    }

    setVocab(vocabs[0])
  }, [defaultVocabId, vocabId, setVocab, vocabs])

  return vocab
}
