"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"

import { SSO_CALLBACK_FLOW_SESSION_STORAGE_KEY } from "@/constants"

type SSOCallbackPageGuardProps = {
    children: React.ReactNode,
}

export const SSOCallbackPageGuard = ({
    children,
}: SSOCallbackPageGuardProps) => {
    const router = useRouter()

    const [isAllowed, setIsAllowed] = useState(false)

    useEffect(() => {
        const ssoCallbackFlag = sessionStorage.getItem(SSO_CALLBACK_FLOW_SESSION_STORAGE_KEY)

        if (ssoCallbackFlag === "true") {
            setIsAllowed(true)

            sessionStorage.removeItem(SSO_CALLBACK_FLOW_SESSION_STORAGE_KEY)
        } else {
            return router.replace("/sign-in")
        }
    }, [])

    if (isAllowed) {
        return (
            <>{children}</>
        )
    }

    return null
}