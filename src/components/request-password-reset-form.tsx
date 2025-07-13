"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2 } from "@tabler/icons-react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { requestPasswordResetFormSchema } from "@/lib/form-schemas"

export const RequestPasswordResetForm = () => {
    const router = useRouter()

    const { isLoaded, signIn } = useSignIn()

    const form = useForm<z.infer<typeof requestPasswordResetFormSchema>>({
        resolver: zodResolver(requestPasswordResetFormSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        if (!isLoaded) {
            return
        }

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: data.email,
            })

            return router.push("/reset-password")
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || "Something went wrong."

            console.log(errorMessage)

            throw new Error(errorMessage)
        }
    })


    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <Input label="Email" id="email" type="text" disabled={form.formState.isSubmitting} errorMessage={form.formState.errors.email?.message} autoComplete="username" {...form.register("email")} />
            <Button className="w-full" size="lg" variant="primary" type="submit" disabled={form.formState.isSubmitting}>

                {form.formState.isSubmitting ? (
                    <IconLoader2 className="size-6 animate-spin transition-all" />
                ) : (
                    "Continue"
                )}

            </Button>
        </form>
    )
}