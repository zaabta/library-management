import type { Request, Response } from 'express'
import {
  getUsers,
  getUserOrThrow,
  createUser,
  borrowBook as borrowBookServices,
  returnBook,
} from '../services'
import { paginationSchema } from '../../../utils/paginator'
import {
  successWithMessage,
  serverError,
  failedWithMessage,
} from '../../../utils/responses'
import { formatValidationErrors } from '../../../utils/format'
import {
  borrowBookSchema,
  byIdSchema,
  createUserSchema,
  returnBorrowedBookSchema,
} from '../validations'

export const list = async (req: Request, res: Response) => {
  try {
    const parsedPaginationSchema = paginationSchema.parse(req.query)
    const users = await getUsers(parsedPaginationSchema)
    successWithMessage('list users successfully', res, users)
  } catch (e) {
    console.log('ERROR --> ', e)
    serverError(res)
  }
}

export const byId = async (req: Request, res: Response) => {
  try {
    const parsedByIdSchema = byIdSchema.safeParse(req.params)
    if (!parsedByIdSchema.success) {
      failedWithMessage('invalid Id', res)
      return
    }
    const users = await getUserOrThrow(parsedByIdSchema.data.id)
    successWithMessage('user is received successfully', res, users)
  } catch (e) {
    console.log('ERROR --> ', e)
    serverError(res)
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    const parsedUserSchema = createUserSchema.safeParse(req.body)
    if (!parsedUserSchema.success) {
      failedWithMessage(formatValidationErrors(parsedUserSchema.error.errors), res)
      return
    }
    const newUser = await createUser(parsedUserSchema.data)
    successWithMessage('user is cerated successfully', res, newUser)
  } catch (e) {
    console.log('ERROR --> ', e)
    serverError(res)
  }
}

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const parsedUserSchema = borrowBookSchema.safeParse(req.params)
    if (!parsedUserSchema.success) {
      failedWithMessage(formatValidationErrors(parsedUserSchema.error.errors), res)
      return
    }
    const borrowedBook = await borrowBookServices(parsedUserSchema.data)
    successWithMessage('book is borrowed successfully', res, borrowedBook)
  } catch (e) {
    console.log('ERROR --> ', e)
    serverError(res, (e as Error).message)
  }
}

export const returnBorrowedBook = async (req: Request, res: Response) => {
  try {
    const parsedUserSchema = returnBorrowedBookSchema.safeParse({
      ...req.params,
      ...req.body,
    })
    if (!parsedUserSchema.success) {
      failedWithMessage(formatValidationErrors(parsedUserSchema.error.errors), res)
      return
    }
    const returnBorrowedBook = await returnBook(parsedUserSchema.data)
    const result = {
      ...returnBorrowedBook[0],
      score: returnBorrowedBook[1].rating,
    }
    successWithMessage('book is returned successfully', res, result)
  } catch (e) {
    console.log('ERROR --> ', e)
    serverError(res, (e as Error).message)
  }
}
