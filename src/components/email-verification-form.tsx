"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2 } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "usehooks-ts"

import { AFTER_SIGN_UP_REDIRECT_PATH, RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER_LOCAL_STORAGE_KEY } from "@/constants"
import { emailVerificationFormSchema } from "@/lib/form-schemas"
import { SecurityCodeInput } from "@/components/ui/security-code-input"
import { Button } from "@/components/ui/button"

const RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER = 30

export const EmailVerificationForm = () => {
    const [isMounted, setIsMounted] = useState(false)

    const [cooldown, setCooldown] = useLocalStorage(RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER_LOCAL_STORAGE_KEY, RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER)

    const router = useRouter()

    const { isLoaded, signUp, setActive } = useSignUp()

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof emailVerificationFormSchema>>({
        resolver: zodResolver(emailVerificationFormSchema),
        defaultValues: {
            verificationCode: "",
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        if (!isLoaded) {
            return
        }

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: data.verificationCode,
            })

            if (result.status === "complete") {
                await setActive({
                    session: result.createdSessionId,
                })

                return router.push(AFTER_SIGN_UP_REDIRECT_PATH)
            }
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || "Something went wrong."

            console.log(errorMessage)

            throw new Error(errorMessage)
        }
    })

    const onValueChange = (value: string) => {
        form.setValue("verificationCode", value)
    }

    const onClick = async () => {
        setIsLoading(true)

        if (!isLoaded) {
            return
        }

        try {
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            })

            return setCooldown(RESEND_EMAIL_VERIFICATION_CODE_COOLDOWN_TIMER)
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || "Something went wrong."

            console.log(errorMessage)

            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (cooldown === 0) {
            return
        }

        const timeout = setTimeout(() => setCooldown((prev) => prev - 1), 1000)

        return () => clearTimeout(timeout)
    }, [cooldown])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <SecurityCodeInput label="Verification code" id="verificationCode" disabled={form.formState.isSubmitting || isLoading} value={form.watch("verificationCode")} type="numeric" errorMessage={form.formState.errors.verificationCode?.message} length={6} onValueChange={onValueChange} />
            <Button className="w-full" size="lg" variant="primary" type="submit" disabled={form.formState.isSubmitting || isLoading}>

                {form.formState.isSubmitting ? (
                    <IconLoader2 className="size-6 animate-spin transition-all" />
                ) : (
                    "Verify email"
                )}

            </Button>
            <Button className="w-full" size="lg" variant="ghost" type="button" disabled={form.formState.isSubmitting || isLoading || cooldown > 0} onClick={onClick}>

                {isLoading ? (
                    <IconLoader2 className="size-6 animate-spin transition-all" />
                ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                ) : (
                    "Resend code"
                )}

            </Button>
        </form>
    )
}