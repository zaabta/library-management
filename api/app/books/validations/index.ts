import { z } from 'zod'

export const byIdSchema = z.object({
  id: z.string().transform(Number),
})

export const createBookSchema = z.object({
  title: z.string().min(3, 'Name must be at least 3 characters long'),
  author: z.string().email('Invalid email address'),
})

export type TCreateUser = z.infer<typeof createBookSchema>
