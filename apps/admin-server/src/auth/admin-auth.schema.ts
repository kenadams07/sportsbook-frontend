import z from "zod";

export const adminLoginSchema = z.object({
    emailOrUsername:z.string().trim().min(1),
    password:z.string().min(1)
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

