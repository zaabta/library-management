import { z } from 'zod'

export const byIdSchema = z.object({
  id: z.string().transform(Number),
})

export const createUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
})

export type ICreateUserSchema = z.infer<typeof createUserSchema>
