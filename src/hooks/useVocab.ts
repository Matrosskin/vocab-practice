import { useVocabs } from './useVocabs';

export const useVocab = (idToReturn?: string) => {
  const vocabs = useVocabs()

  // TODO: Does it make sense to save id of default vocab into user config instead of keep it inside vocab?
  return idToReturn
    ? vocabs.find(({id}) => id === idToReturn)
    : vocabs.find(({isDefault}) => isDefault)
}
