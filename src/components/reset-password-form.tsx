"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2 } from "@tabler/icons-react"
import { useClerk, useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { SecurityCodeInput } from "@/components/ui/security-code-input"
import { Button } from "@/components/ui/button"
import { resetPassswordFormSchema } from "@/lib/form-schemas"
import { PasswordInput } from "@/components/ui/password-input"
import { ButtonLink } from "@/components/ui/button-link"
import { RESET_PASSWORD_FLOW_SESSION_STORAGE_KEY } from "@/constants"

export const ResetPasswordForm = () => {
    const { signOut } = useClerk()

    const [hidden, setHidden] = useState(true)

    const router = useRouter()

    const { isLoaded, signIn } = useSignIn()

    const form = useForm<z.infer<typeof resetPassswordFormSchema>>({
        resolver: zodResolver(resetPassswordFormSchema),
        defaultValues: {
            resetPasswordCode: "",
            newPassword: "",
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        setHidden(true)

        if (!isLoaded) {
            return
        }

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: data.resetPasswordCode,
                password: data.newPassword,
            })

            if (result.status === "complete") {
                await signOut()

                sessionStorage.removeItem(RESET_PASSWORD_FLOW_SESSION_STORAGE_KEY)

                return router.push("/sign-in")
            }
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || "Something went wrong."

            console.log(errorMessage)

            throw new Error(errorMessage)
        }
    })

    const onValueChange = (value: string) => {
        form.setValue("resetPasswordCode", value)
    }

    const onEyeButtonClick = () => setHidden((prev) => !prev)

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <SecurityCodeInput label="Password reset code" id="resetPasswordCode" disabled={form.formState.isSubmitting} value={form.watch("resetPasswordCode")} type="numeric" errorMessage={form.formState.errors.resetPasswordCode?.message} length={6} onValueChange={onValueChange} />
            <PasswordInput label="New password" id="newPassword" disabled={form.formState.isSubmitting} errorMessage={form.formState.errors.newPassword?.message} autoComplete="new-password" hidden={hidden} onEyeButtonClick={onEyeButtonClick} {...form.register("newPassword")} />
            <Button className="w-full" size="lg" variant="primary" type="submit" disabled={form.formState.isSubmitting}>

                {form.formState.isSubmitting ? (
                    <IconLoader2 className="size-6 animate-spin transition-all" />
                ) : (
                    "Reset password"
                )}

            </Button>
            <ButtonLink className="w-full" size="lg" variant="ghost" href="/forgot-password">No code? Let’s roll it back</ButtonLink>
        </form>
    )
}