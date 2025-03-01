import { z } from 'zod'

export const byIdSchema = z.object({
  id: z.string().transform(Number),
})

export const createUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
})

export type TCreateUser = z.infer<typeof createUserSchema>

export const borrowBookSchema = z.object({
  userId: z.string().transform(Number),
  bookId: z.string().transform(Number),
})

export type TBorrowBook = z.infer<typeof borrowBookSchema>

export const returnBorrowedBookSchema = borrowBookSchema.and(
  z.object({
    score: z.number().positive(),
    comment: z.string().optional(),
  }),
)

export type TReturnBorrowedBook = z.infer<typeof returnBorrowedBookSchema>
