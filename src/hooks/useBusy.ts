import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "./store"
import { setBusy } from '../slices/appSlice'

export const useBusy = (): [boolean, (isBusy: boolean) => void] => {
  const isBusy = useAppSelector((state) => state.app.isBusy)
  const dispatch = useAppDispatch()

  const setIsBusy = useCallback((newBusyState: boolean) => {
    dispatch(setBusy(newBusyState))
  }, [dispatch])

  return [isBusy, setIsBusy]
}
