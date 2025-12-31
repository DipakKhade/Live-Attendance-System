import z from 'zod'

export const signin_schema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(4),
    role: z.enum(["student", "teacher"])
})


export const login_schema = z.object({
    email: z.string(),
    password: z.string().min(4)
})
