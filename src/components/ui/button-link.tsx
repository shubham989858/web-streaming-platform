"use client"

import Link, { LinkProps } from "next/link"
import { forwardRef, AnchorHTMLAttributes } from "react"
import { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & VariantProps<typeof buttonVariants>

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(({
    variant = "default",
    size = "md",
    iconOnly = false,
    className = "",
    href,
    onClick = () => { },
    children,
    ...rest
}, ref) => {
    return (
        <Link className={cn(buttonVariants({
            size,
            variant,
            iconOnly,
        }), className)} href={href} ref={ref} {...rest}>{children}</Link>
    )
})