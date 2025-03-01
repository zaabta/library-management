import { prisma } from '../../../prisma'
import {
  paginator,
  TPaginationArgs,
  TPaginationSchema,
} from '../../../utils/paginator'
import { TCreateUser } from '../validations'

export const getBooks = async (paginationSchema: TPaginationSchema) => {
  const paginatorQuery = async ({ skip, take }: TPaginationArgs) => {
    return {
      total: await prisma.book.count(),
      data: await prisma.book.findMany({
        skip,
        take,
        select: { id: true, title: true, author: true },
      }),
    }
  }
  return paginator(paginatorQuery, paginationSchema)
}

export const getBookOrThrow = async (id: number) => {
  const foundBook = await prisma.book.findUniqueOrThrow({
    where: { id },
    include: {
      rating: {
        select: {
          rating: true,
        },
      },
    },
  })
  const { rating, ...rest } = foundBook
  return {
    ...rest,
    score:
      rating.length > 0
        ? rating.reduce((sum, rate) => sum + rate.rating, 0) / rating.length
        : -1,
  }
}

export const createBook = async (data: TCreateUser) => {
  return await prisma.book.create({
    data,
  })
}
