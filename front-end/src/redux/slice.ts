import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api, API_URLS } from '../api'
import {
  BORROW_BOOK,
  RETURN_BOOK,
  FETCH_USERS,
  FETCH_USER,
  FETCH_BOOKS,
  FETCH_BOOK,
} from './action-types'

export const fetchUsersThunk = createAsyncThunk(
  FETCH_USERS,
  async ({ page, perPage }: { page: number; perPage: number }) => {
    try {
      const response = await api.get(API_URLS.USERS.LIST(page, perPage))
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch users')
    }
  },
)

export const fetchUserThunk = createAsyncThunk(
  FETCH_USER,
  async (id: number) => {
    try {
      const response = await api.get(API_URLS.USERS.GET(id))
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch user')
    }
  },
)

export const fetchBooksThunk = createAsyncThunk(
  FETCH_BOOKS,
  async ({
    page,
    perPage,
    available,
  }: {
    page: number
    perPage: number
    available: boolean
  }) => {
    try {
      const response = await api.get(
        API_URLS.BOOKS.LIST(page, perPage, available),
      )
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch books')
    }
  },
)

export const fetchBookThunk = createAsyncThunk(
  FETCH_BOOK,
  async (id: number) => {
    try {
      const response = await api.get(API_URLS.BOOKS.GET(id))
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch book')
    }
  },
)

export const borrowBookThunk = createAsyncThunk(
  BORROW_BOOK,
  async ({ userId, bookId }: { userId: number; bookId: number }) => {
    try {
      const response = await api.post(API_URLS.USERS.BORROW(userId, bookId))
      return response.data
    } catch (error) {
      throw new Error('Failed to borrow the book')
    }
  },
)

export const returnBookThunk = createAsyncThunk(
  RETURN_BOOK,
  async ({ userId, bookId, score }: { userId: number; bookId: number, score: number }) => {
    try {
      const response = await api.post(API_URLS.USERS.RETURN(userId, bookId), {
        score
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to return the book')
    }
  },
)

export const initialState = {
  users: [],
  books: [],
  user: {},
  book: {},
  loading: false,
  error: null as string | null,
}

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.data
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message || 'An unknown error occurred'
      })
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message || 'An unknown error occurred'
      })
      .addCase(fetchBooksThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBooksThunk.fulfilled, (state, action) => {
        state.loading = false
        state.books = action.payload.data
      })
      .addCase(fetchBooksThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An unknown error occurred'
      })
      .addCase(fetchBookThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBookThunk.fulfilled, (state, action) => {
        state.loading = false
        state.book = action.payload.data
      })
      .addCase(fetchBookThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An unknown error occurred'
      })
  },
})

export default librarySlice.reducer
