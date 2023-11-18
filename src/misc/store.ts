import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../slices/userSlice'
import { appSlice } from '../slices/appSlice'

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    app: appSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
