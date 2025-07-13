"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2 } from "@tabler/icons-react"
import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

import { RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER_LOCAL_STORAGE_KEY } from "@/constants"
import { signInFormSchema } from "@/lib/form-schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { ButtonLink } from "@/components/ui/button-link"

export const SignInForm = () => {
    const router = useRouter()

    const { isLoaded, signIn, setActive } = useSignIn()

    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const [hidden, setHidden] = useState(true)

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        setHidden(true)

        if (!isLoaded) {
            return
        }

        try {
            const result = await signIn.create({
                identifier: data.email,
                password: data.password,
            })

            if (result.status === "complete") {
                await setActive({
                    session: result.createdSessionId,
                })

                localStorage.removeItem(RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER_LOCAL_STORAGE_KEY)

                return router.push("/")
            }
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || "Something went wrong."

            console.log(errorMessage)

            throw new Error(errorMessage)
        }
    })

    const onEyeButtonClick = () => setHidden((prev) => !prev)

    const onGoogleButtonClick = async () => {
        setHidden(true)

        form.reset(form.getValues())

        setIsGoogleLoading(true)

        if (!isLoaded) {
            return
        }

        try {
            localStorage.removeItem(RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER_LOCAL_STORAGE_KEY)

            return await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            })
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || "Something went wrong."

            console.log(errorMessage)

            throw new Error(errorMessage)
        } finally {
            setIsGoogleLoading(false)
        }
    }

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
                <Input label="Email" id="email" type="text" disabled={form.formState.isSubmitting || isGoogleLoading} errorMessage={form.formState.errors.email?.message} autoComplete="username" {...form.register("email")} />
                <PasswordInput label="Password" id="password" disabled={form.formState.isSubmitting || isGoogleLoading} errorMessage={form.formState.errors.password?.message} autoComplete="current-password" hidden={hidden} onEyeButtonClick={onEyeButtonClick} {...form.register("password")} />
                <Button className="w-full" size="lg" variant="primary" type="submit" disabled={form.formState.isSubmitting || isGoogleLoading}>

                    {form.formState.isSubmitting ? (
                        <IconLoader2 className="size-6 animate-spin transition-all" />
                    ) : (
                        "Sign in"
                    )}

                </Button>
            </div>
            <div className="flex items-center gap-x-2">
                <div className="h-px flex-1 bg-zinc-700" />
                <p className="text-sm text-white/70">Or use</p>
                <div className="h-px flex-1 bg-zinc-700" />
            </div>
            <div className="space-y-4">
                <GoogleAuthButton showSpinner={isGoogleLoading} disabled={form.formState.isSubmitting || isGoogleLoading} onClick={onGoogleButtonClick} />
                <ButtonLink className="w-full" size="lg" variant="ghost" href="/forgot-password">Forgot password?</ButtonLink>
            </div>
        </form>
    )
}