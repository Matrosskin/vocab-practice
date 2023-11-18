import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IUserSlice {
  isBusy: boolean
  busyCounter: number
}

const initialState: IUserSlice = {
  isBusy: true,
  busyCounter: 0,
}

export const appSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setBusy(state, { payload: isBusy }: PayloadAction<boolean>) {
      if (isBusy) {
        state.isBusy = true
        state.busyCounter++
      } else {
        state.busyCounter--
        if (state.busyCounter <= 0) {
          state.isBusy = false
          state.busyCounter = 0
        }
      }
    },
  },
})

export const { setBusy } = appSlice.actions
