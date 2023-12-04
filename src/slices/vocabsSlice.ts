import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IVocab } from '../interfaces/IVocab'

interface IVocabsSlice {
  vocabs: IVocab[]
}

const initialState: IVocabsSlice = {
  vocabs: [],
}

export const vocabsSlice = createSlice({
  name: 'vocabs',
  initialState,
  reducers: {
    setVocabs(state, { payload: vocabs }: PayloadAction<IVocab[]>) {
      state.vocabs = vocabs
    },
  },
})

export const { setVocabs } = vocabsSlice.actions
