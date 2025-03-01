import { z } from 'zod'

export const byIdSchema = z.object({
  id: z.string().transform(Number),
})

export const createBookSchema = z.object({
  title: z.string(),
  author: z.string(),
})

export type TCreateBook = z.infer<typeof createBookSchema>
