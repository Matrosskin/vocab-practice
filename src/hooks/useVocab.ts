import { useUserSettings } from './useUserSettings';
import { useVocabs } from './useVocabs';

export const useVocab = (idToReturn?: string) => {
  const vocabs = useVocabs()
  const { defaultVocabId } = useUserSettings()

  return idToReturn
    ? vocabs.find(({id}) => id === idToReturn)
    : vocabs.find(({id}) => id === defaultVocabId)
}
