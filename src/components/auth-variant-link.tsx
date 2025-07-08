"use client"

import { usePathname } from "next/navigation"

import { ButtonLink } from "@/components/ui/button-link"

export const AuthVariantLink = () => {
    const pathname = usePathname()

    return (
        <ButtonLink variant="ghost" href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>{pathname === "/sign-in" ? "Sign up" : "Sign in"}</ButtonLink>
    )
}