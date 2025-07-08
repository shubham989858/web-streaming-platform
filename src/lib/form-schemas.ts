import { z } from "zod"

export const signUpFormSchema = z.object({
    name: z.string().nonempty({
        message: "Name is required.",
    }).refine((value) => value.trim() !== "", {
        message: "Name cannot be blank.",
    }),
    email: z.string().nonempty({
        message: "Email is required.",
    }).email({
        message: "Email is invalid.",
    }),
    password: z.string().nonempty({
        message: "Password is required.",
    }).min(8, {
        message: "Password must be 8 - 20 characters long.",
    }).max(20, {
        message: "Password must be 8 - 20 characters long.",
    }).regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase character.",
    }).regex(/[a-z]/, {
        message: "Password must contain at least one lowercase character.",
    }).regex(/[0-9]/, {
        message: "Password must contain at least one digit.",
    }).regex(/[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]/, {
        message: "Password must contain at least one special character.",
    }),
})

export const signInFormSchema = z.object({
    email: z.string().nonempty({
        message: "Email is required.",
    }).email({
        message: "Email is invalid.",
    }),
    password: z.string().nonempty({
        message: "Password is required.",
    }),
})