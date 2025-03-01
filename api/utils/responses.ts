import type { Response } from 'express'

export type SuccessResponse<T = any> = {
  success: true
  data: T
  messages: string
  time: number
} & Record<string, any>

export type ErrorResponse<T = any> = {
  success: false
  data: T
  messages: string
  time: number
}

export const successResponse = <T = any>(
  messages: string = '',
  data: T = ([] as unknown) as T,
  extras: Record<string, any> = {},
): SuccessResponse<T> => ({
  success: true,
  data,
  messages,
  time: Date.now(),
  ...extras,
})

export const errorResponse = <T = any>(
  messages: string = '',
  data: T = ([] as unknown) as T,
): ErrorResponse<T> => ({
  success: false,
  data,
  messages,
  time: Date.now(),
})

export const unauthorized = (res: Response) =>
  res.status(401).json(errorResponse('Unauthorized, please login!'))

export const unauthenticated = (res: Response) =>
  res.status(401).json(errorResponse('Unauthenticated, please login first.'))

export const failedWithMessage = (msg: string, res: Response) =>
  res.status(400).json(errorResponse(msg))

export const serverError = (res: Response, error: string | null = null) =>
  res
    .status(500)
    .json(errorResponse(error || 'Something went wrong, please try again later.'))

export const forbidden = (res: Response) =>
  res.status(403).json(errorResponse('Forbidden'))

export const notAcceptable = (res: Response) =>
  res.status(406).json(errorResponse('Not Acceptable'))

export const successWithMessage = <T = any>(
  msg: string,
  res: Response,
  data: T = ([] as unknown) as T,
) => res.status(200).json(successResponse(msg, data))
