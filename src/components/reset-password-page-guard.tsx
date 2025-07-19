"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"

import { RESET_PASSWORD_FLOW_SESSION_STORAGE_KEY } from "@/constants"

type ResetPasswordPageGuardProps = {
    children: React.ReactNode,
}

export const ResetPasswordPageGuard = ({
    children,
}: ResetPasswordPageGuardProps) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const resetPasswordFlowFlag = sessionStorage.getItem(RESET_PASSWORD_FLOW_SESSION_STORAGE_KEY)

        if (resetPasswordFlowFlag !== "true") {
            return router.replace("/forgot-password")
        }

        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <IconLoader2 className="size-8 mx-auto animate-spin" />
        )
    }

    return (
        <>{children}</>
    )
}