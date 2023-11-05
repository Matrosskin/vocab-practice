import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
  uid: string
  email: string | null
  displayName: string | null
}

interface IUserSlice {
  isDetermined: boolean
  user: IUser | null
}

const initialState: IUserSlice = {
  isDetermined: false,
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDetermined(state) {
      state.isDetermined = true
    },
    setUser(state, { payload: user }: PayloadAction<IUser | null>) {
      state.user = user
    },
  },
})

export const { setDetermined, setUser } = userSlice.actions
