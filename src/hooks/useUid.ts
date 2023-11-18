import { useAppSelector } from './store'

export const useUid = () => {
  return useAppSelector((state) => state.user.user?.uid)
}
