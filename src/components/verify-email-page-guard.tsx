"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { IconLoader2 } from "@tabler/icons-react"

type VerifyEmailPageGuardProps = {
    children: React.ReactNode,
}

export const VerifyEmailPageGuard = ({
    children,
}: VerifyEmailPageGuardProps) => {
    const router = useRouter()

    const { isLoaded, signUp } = useSignUp()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!isLoaded) {
            return
        }

        if (signUp.status !== "missing_requirements") {
            return router.back()
        }

        setIsLoading(false)
    }, [isLoaded, signUp])

    if (isLoading) {
        return (
            <IconLoader2 className="size-8 mx-auto transition-all animate-spin" />
        )
    }

    return (
        <>{children}</>
    )
}