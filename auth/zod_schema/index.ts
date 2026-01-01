import z from 'zod'

export const ROLE_ENUM = z.enum(["student", "teacher"])

export const signin_schema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(4),
    role: ROLE_ENUM
})

export const login_schema = z.object({
    email: z.string(),
    password: z.string().min(4)
})
