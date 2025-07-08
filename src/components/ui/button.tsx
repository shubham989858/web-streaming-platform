"use client"

import { forwardRef, ButtonHTMLAttributes } from "react"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const buttonVariants = cva("cursor-pointer w-fit flex items-center justify-center font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-background", {
    variants: {
        variant: {
            default: "text-slate-950 bg-white hover:text-slate-950/80 hover:bg-white/80",
            primary: "text-white bg-pluto hover:text-white/80 hover:bg-pluto/80",
            ghost: "text-white/80 hover:text-white hover:bg-white/10",
        },
        size: {
            sm: "h-8 px-3 rounded-md text-xs gap-x-1.5",
            md: "h-10 px-4 rounded-lg text-sm gap-x-2",
            lg: "h-12 px-5 rounded-[0.625rem] text-base gap-x-2.5",
        },
        iconOnly: {
            true: "p-0",
            false: "",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
        iconOnly: false,
    },
    compoundVariants: [
        {
            size: "sm",
            iconOnly: true,
            class: "w-8"
        }, {
            size: "md",
            iconOnly: true,
            class: "w-10"
        }, {
            size: "lg",
            iconOnly: true,
            class: "w-12"
        },
    ],
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = "default",
    size = "md",
    iconOnly = false,
    className = "",
    type = "button",
    disabled = false,
    onClick = () => { },
    children,
    ...rest
}, ref) => {
    return (
        <button className={cn(buttonVariants({
            size,
            variant,
            iconOnly,
        }), className)} type={type} disabled={disabled} onClick={onClick} ref={ref} {...rest}>{children}</button>
    )
})