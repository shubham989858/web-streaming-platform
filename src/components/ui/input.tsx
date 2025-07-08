"use client"

import { forwardRef, InputHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type AllowedInputTypes = "text" | "email" | "password" | "search" | "number" | "url" | "tel"

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    wrapperClassName?: string,
    labelClassName?: string,
    label: string,
    id: string,
    type?: AllowedInputTypes,
    disabled?: boolean,
    errorMessage?: string,
    errorMessageClassName?: string,
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    wrapperClassName = "",
    labelClassName = "",
    label,
    id,
    errorMessage = "",
    errorMessageClassName = "",
    className = "",
    type = "text",
    disabled = false,
    ...rest
}, ref) => {
    return (
        <div className={cn("space-y-3", wrapperClassName)}>
            <div className="flex flex-col-reverse group">
                <input className={cn("w-full h-10 px-3 rounded-lg border border-zinc-700 bg-background text-sm text-white peer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-background transition-all focus-visible:border-zinc-700", !!errorMessage && "border-rose-700", className)} id={id} type={type} disabled={disabled} ref={ref} {...rest} />
                <label className={cn("font-medium block pb-3 text-white/80 group-hover:text-white transition-all peer-focus-visible:text-white peer-disabled:text-white/80", labelClassName)} htmlFor={id}>{label}</label>
            </div>

            {!!errorMessage && (
                <p className={cn("text-sm italic text-rose-600", errorMessageClassName)} id={`${id}-error`}>{errorMessage}</p>
            )}

        </div>
    )
})