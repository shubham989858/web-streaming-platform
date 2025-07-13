import { z } from "zod"

import { validateSecurityCode } from "@/lib/utils"

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

export const emailVerificationFormSchema = z.object({
    verificationCode: z.string().nonempty({
        message: "Verification code is required.",
    }).length(6, {
        message: "Verification code must be exactly 6 characters long.",
    }).refine((value) => validateSecurityCode(value), {
        message: "Verification code is invalid.",
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

export const requestPasswordResetFormSchema = z.object({
    email: z.string().nonempty({
        message: "Email is required.",
    }).email({
        message: "Email is invalid.",
    }),
})

export const resetPassswordFormSchema = z.object({
    resetPasswordCode: z.string().nonempty({
        message: "Password reset code is required.",
    }).length(6, {
        message: "Password reset code must be exactly 6 characters long.",
    }).refine((value) => validateSecurityCode(value), {
        message: "Password reset code is invalid.",
    }),
    newPassword: z.string().nonempty({
        message: "New password is required.",
    }).min(8, {
        message: "New password must be 8 - 20 characters long.",
    }).max(20, {
        message: "New password must be 8 - 20 characters long.",
    }).regex(/[A-Z]/, {
        message: "New password must contain at least one uppercase character.",
    }).regex(/[a-z]/, {
        message: "New password must contain at least one lowercase character.",
    }).regex(/[0-9]/, {
        message: "New password must contain at least one digit.",
    }).regex(/[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]/, {
        message: "New password must contain at least one special character.",
    }),
})