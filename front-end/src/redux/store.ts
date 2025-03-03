import { configureStore } from '@reduxjs/toolkit'
import libraryReducer from './slice'

export const store = configureStore({
  reducer: {
    library: libraryReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>