import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const signUpSchema = z.object({
  name: z.string().min(2),
})

export type ILogin = z.infer<typeof loginSchema>
export type ISignUp = z.infer<typeof signUpSchema>