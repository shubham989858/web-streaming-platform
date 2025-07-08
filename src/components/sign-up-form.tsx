"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2 } from "@tabler/icons-react"
import { useState } from "react"

import { signUpFormSchema } from "@/lib/form-schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { GoogleAuthButton } from "@/components/google-auth-button"

export const SignUpForm = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const [hidden, setHidden] = useState(true)

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        setHidden(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 5000))

            return console.log(data)
        } catch (error) {
            console.log("Something went wrong.")

            console.log(error)

            throw new Error("Something went wrong.")
        }
    })

    const onEyeButtonClick = () => setHidden((prev) => !prev)

    const onGoogleButtonClick = async () => {
        setHidden(true)

        form.reset(form.getValues())

        setIsGoogleLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 5000))

            return console.log("google")
        } catch (error) {
            console.log("Something went wrong.")

            console.log(error)

            throw new Error("Something went wrong.")
        } finally {
            setIsGoogleLoading(false)
        }
    }

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
                <Input label="Name" id="name" type="text" disabled={form.formState.isSubmitting || isGoogleLoading} errorMessage={form.formState.errors.name?.message} autoComplete="name" {...form.register("name")} />
                <Input label="Email" id="email" type="text" disabled={form.formState.isSubmitting || isGoogleLoading} errorMessage={form.formState.errors.email?.message} autoComplete="email" {...form.register("email")} />
                <PasswordInput label="Password" id="password" disabled={form.formState.isSubmitting || isGoogleLoading} errorMessage={form.formState.errors.password?.message} autoComplete="new-password" hidden={hidden} onEyeButtonClick={onEyeButtonClick} maxLength={20} {...form.register("password")} />
                <Button className="w-full" size="lg" variant="primary" type="submit" disabled={form.formState.isSubmitting || isGoogleLoading}>

                    {form.formState.isSubmitting ? (
                        <IconLoader2 className="size-6 animate-spin transition-all" />
                    ) : (
                        "Continue"
                    )}

                </Button>
            </div>
            <div className="flex items-center gap-x-2">
                <div className="h-px flex-1 bg-zinc-700" />
                <p className="text-sm text-white/70">Or use</p>
                <div className="h-px flex-1 bg-zinc-700" />
            </div>
            <GoogleAuthButton showSpinner={isGoogleLoading} disabled={form.formState.isSubmitting || isGoogleLoading} onClick={onGoogleButtonClick} />
        </form>
    )
}