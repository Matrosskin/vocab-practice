import { useAppSelector } from './store'

export const useVocabs = () => {
  return useAppSelector((state) => state.vocabs.vocabs)
}
