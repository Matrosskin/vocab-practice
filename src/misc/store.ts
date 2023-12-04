import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../slices/userSlice'
import { appSlice } from '../slices/appSlice'
import { vocabsSlice } from '../slices/vocabsSlice'

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    app: appSlice.reducer,
    vocabs: vocabsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
