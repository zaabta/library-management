import axios from 'axios'
import { notification } from 'antd'

const API_ROOT =
  process.env.REACT_APP_API_URL ||
  'https://library-management-api-zaabtas-projects.vercel.app'

console.log('API Root:', API_ROOT)

export const api = axios.create({
  baseURL: `${API_ROOT}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    const { success, messages } = response.data
    const toaster =  {
      message: success ? 'success': 'error',
      description: messages,
    }
    success
      ? notification.success(toaster)
      : notification.warning(toaster)
    return response
  },
  (error) => {
    const { message } = error.response.data
    notification.error({
      message: 'Error',
      description: message,
    })
    return Promise.reject(error)
  },
)

export const API_URLS = {
  ROOT: API_ROOT,
  USERS: {
    LIST: (page: number, perPage: number) =>
      `${API_ROOT}/api/v1/users?page=${page}&perPage=${perPage}`,
    GET: (id: number) => `${API_ROOT}/api/v1/users/${id}`,
    BORROW: (userId: number, bookId: number) =>
      `${API_ROOT}/api/v1/users/${userId}/borrow/${bookId}`,
    RETURN: (userId: number, bookId: number) =>
      `${API_ROOT}/api/v1/users/${userId}/return/${bookId}`,
  },
  BOOKS: {
    LIST: (page: number, perPage: number, available: boolean) =>
      `${API_ROOT}/api/v1/books?page=${page}&perPage=${perPage}&available=${available}`,
    GET: (id: number) => `${API_ROOT}/api/v1/books/${id}`,
  },
}
