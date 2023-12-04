import { useMemo, useRef } from 'react'
import { useAppDispatch } from './store'
import { setBusy } from '../slices/appSlice'

interface IUseBusyReturn {
  setIsBusy: (isBusy: boolean) => void
  setBusy: () => void
  setNotBusy: () => void
  threeS: {
    start: () => void
    stop: () => void
    reset: () => void
  }
}

enum ThreeStates {
  Ready,
  InProgress,
  Chilling,
}

export const useBusy = (): IUseBusyReturn => {
  const dispatch = useAppDispatch()
  const threeStateRef = useRef<ThreeStates>(ThreeStates.Ready)

  return useMemo(
    () => ({
      setIsBusy: (newBusyState: boolean) => {
        dispatch(setBusy(newBusyState))
      },
      setBusy: () => {
        dispatch(setBusy(true))
      },
      setNotBusy: () => {
        dispatch(setBusy(true))
      },
      threeS: {
        start: () => {
          if (threeStateRef.current !== ThreeStates.Ready) return

          dispatch(setBusy(true))
          threeStateRef.current = ThreeStates.InProgress
        },
        stop: () => {
          if (threeStateRef.current !== ThreeStates.InProgress) return

          dispatch(setBusy(false))
          threeStateRef.current = ThreeStates.Chilling
        },
        reset: () => {
          if (threeStateRef.current === ThreeStates.InProgress) {
            dispatch(setBusy(false))
          }

          threeStateRef.current = ThreeStates.Ready
        },
      },
    }),
    [dispatch]
  )
}
