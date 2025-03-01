import { type Prisma, prisma } from '../../../prisma'
import {
  paginator,
  TPaginationArgs,
  TPaginationSchema,
} from '../../../utils/paginator'
import { TCreateUser } from '../validations'

export const getBooks = async (
  paginationSchema: TPaginationSchema,
) => {
  const { available } = paginationSchema
  const paginatorQuery = async ({ skip, take }: TPaginationArgs) => {
    const whereCondition: Prisma.BookWhereInput = available
      ? {
          borrowedBooks: {
            every: { returnedAt: { not: null } },
          } as Prisma.BorrowedBookListRelationFilter,
        }
      : {}

    return {
      total: await prisma.book.count({ where: whereCondition }),
      data: await prisma.book.findMany({
        where: whereCondition,
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
      borrowedBooks: {
        select: {
          user: true,
          borrowedAt: true,
          returnedAt: true,
        },
      },
      rating: {
        select: {
          rating: true,
        },
      },
    },
  })

  const { rating, borrowedBooks, ...rest } = foundBook

  const available = !borrowedBooks.some(({ returnedAt }) => returnedAt === null)

  const averageScore =
    rating.length > 0
      ? rating.reduce((sum, rate) => sum + rate.rating, 0) / rating.length
      : -1

  const currentUserBorrowing =
    available || borrowedBooks.length === 0
      ? null
      : borrowedBooks.find(({ returnedAt }) => returnedAt === null)?.user ||
        null

  return {
    ...rest,
    score: Number(averageScore.toFixed(1)),
    history: borrowedBooks,
    available,
    currentUserBorrowing,
  }
}

export const createBook = async (data: TCreateUser) => {
  return await prisma.book.create({
    data,
  })
}
