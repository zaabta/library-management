import type { Request, Response } from 'express'
import { getUsers, getUserOrThrow, createUser } from '../services'
import { paginationSchema } from '../../../utils/paginator'
import {
  successWithMessage,
  serverError,
  failedWithMessage,
} from '../../../utils/responses'
import { byIdSchema, createUserSchema } from '../validations'

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
      failedWithMessage(parsedUserSchema.error.message, res)
      return
    }
    const newUser = await createUser(parsedUserSchema.data)
    successWithMessage('user is cerated successfully', res, newUser)
  } catch (e) {
    console.log('ERROR --> ', e)
    serverError(res)
  }
}
