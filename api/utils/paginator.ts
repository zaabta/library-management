import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  available: z.union([z.literal('true'), z.literal('false')])
    .optional()
    .transform(val => val === 'true'),
})

export type TPaginationSchema = Zod.infer<typeof paginationSchema>

export type TPaginatorQueryReturn = Promise<{
  total: number
  data: { [key in string]: any }[]
}>

export type TPaginationArgs = {
  skip: number
  take: number
}

export type TPaginatorQuery = (
  paginationArgs: TPaginationArgs,
) => TPaginatorQueryReturn

export type PaginationResult<T> = Promise<{
  data: T
  meta: {
    lastPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}>

/**
 * Generic paginator function for Prisma queries
 */
export async function paginator<
  CurrentPaginatorQueryReturn extends TPaginatorQueryReturn
>(
  paginatorQuery: TPaginatorQuery,
  paginationSchema: TPaginationSchema,
): PaginationResult<Awaited<CurrentPaginatorQueryReturn>['data']> {
  const page = Number(paginationSchema.page)
  const perPage = Number(paginationSchema.perPage)
  const skip = page > 0 ? perPage * (page - 1) : 0

  const totalAndData = await paginatorQuery({ skip, take: perPage })

  const lastPage = Math.ceil(totalAndData['total'] / perPage)

  return {
    data: totalAndData['data'],
    meta: {
      lastPage,
      perPage,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  }
}
