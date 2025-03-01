import { type Request, type Response } from 'express'
import { failedWithMessage, serverError, successWithMessage } from '../../../utils/responses'
import { paginationSchema } from '../../../utils/paginator'
import { getBooks, getBookOrThrow, createBook } from '../services'
import { byIdSchema, createBookSchema } from '../validations'

export const list = async (req: Request, res: Response) => {
  try {
    const parsedPaginationSchema = paginationSchema.parse(req.query)
    const users = await getBooks(parsedPaginationSchema)
    successWithMessage('list books successfully', res, users)
  } catch (e) {
    console.log("ERROR --> ", e)
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
        const users = await getBookOrThrow(parsedByIdSchema.data.id)
        successWithMessage('book is received successfully', res, users)
    } catch (e) {
        console.log('ERROR --> ', e)
        serverError(res)
    }
}


export const create = async (req: Request, res: Response) => {
  try {
    const parsedUserSchema = createBookSchema.safeParse(req.body)
    if (!parsedUserSchema.success) {
      failedWithMessage(parsedUserSchema.error.message, res)
      return
    }
    const newUser = await createBook(parsedUserSchema.data)
    successWithMessage('book is cerated successfully', res, newUser)
  } catch (e) {
    console.log('ERROR --> ', e)
      serverError(res)
  }
}