import z from 'zod';

export const add_class_schema = z.object({
    class_name: z.string(),
    student_ids: z.array(z.string()).optional()
})

export const add_class_student_schema = z.object({
    student_id: z.string()
})

export const start_class_schema = z.object({
    class_id: z.string()
})