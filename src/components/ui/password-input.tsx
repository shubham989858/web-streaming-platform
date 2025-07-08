"use client"

import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { forwardRef, InputHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
    wrapperClassName?: string,
    labelClassName?: string,
    label: string,
    id: string,
    errorMessage?: string,
    errorMessageClassName?: string,
    hidden: boolean,
    onEyeClick: () => void,
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
    wrapperClassName = "",
    labelClassName = "",
    label,
    id,
    errorMessage = "",
    errorMessageClassName = "",
    hidden,
    onEyeClick,
    className = "",
    disabled = false,
    ...rest
}, ref) => {
    return (
        <div className={cn("space-y-3", wrapperClassName)}>
            <div className="flex flex-col-reverse group">
                <div className="relative">
                    <input className={cn("w-full h-10 px-3 rounded-lg border border-zinc-700 bg-background text-sm text-white peer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-background transition-all focus-visible:border-zinc-700", !!errorMessage && "border-rose-700", className)} id={id} type={hidden ? "password" : "text"} disabled={disabled} ref={ref} {...rest} />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-all text-white/70 hover:text-white" type="button" disabled={disabled} onClick={onEyeClick}>

                        {hidden ? (
                            <IconEyeOff className="size-5" />
                        ) : (
                            <IconEye className="size-5" />
                        )}

                    </button>
                </div>
                <label className={cn("font-medium block pb-3 text-white/80 group-hover:text-white transition-all peer-focus-visible:text-white peer-disabled:text-white/80", labelClassName)} htmlFor={id}>{label}</label>
            </div>

            {!!errorMessage && (
                <p className={cn("text-sm italic text-rose-600", errorMessageClassName)} id={`${id}-error`}>{errorMessage}</p>
            )}

        </div>
    )
})