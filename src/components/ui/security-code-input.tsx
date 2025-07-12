"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

type SecurityCodeInputType = "numeric" | "alphanumeric" | "alphanumeric-uppercase"

type SecurityCodeInputProps = {
    wrapperClassName?: string,
    labelClassName?: string,
    label: string,
    id: string,
    type?: SecurityCodeInputType,
    disabled?: boolean,
    length: number,
    value: string,
    onValueChange: (value: string) => void,
    errorMessage?: string,
    errorMessageClassName?: string,
}

const sanitizeText = (text: string, securityCodeInputType: SecurityCodeInputType) => {
    switch (securityCodeInputType) {
        case "numeric":
            return text.replace(/[^0-9]/g, "")
        case "alphanumeric":
            return text.replace(/[^A-Za-z0-9]/g, "")
        case "alphanumeric-uppercase":
            return text.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    }
}

export const SecurityCodeInput = ({
    wrapperClassName = "",
    labelClassName = "",
    label,
    id,
    type = "numeric",
    disabled = false,
    length,
    value,
    onValueChange,
    errorMessage = "",
    errorMessageClassName = "",
}: SecurityCodeInputProps) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    const valueArray = Array.from({
        length,
    }).map((_, i) => value[i] || "")

    const inputMode = type === "numeric" ? "numeric" : "text"

    const inputPattern = type === "numeric" ? "\\d*" : "[A-Za-z0-9]*"

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus()

        inputRefs.current[index]?.select()
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const character = sanitizeText(e.target.value, type)[0] ?? ""

        if (!character) {
            return
        }

        const newSecurityCode = [...valueArray]

        newSecurityCode[index] = character

        onValueChange(newSecurityCode.join(""))

        if (index < length - 1) {
            focusInput(index + 1)
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const removeKey = e.key === "Backspace" || e.key === "Delete"

        if (!removeKey) {
            return
        }

        if (index === 0 && !valueArray[0]) {
            return
        }

        if (!e.repeat) {
            e.preventDefault()
        }

        const newSecurityCode = [...valueArray]

        if (!!valueArray[index]) {
            newSecurityCode[index] = ""
        } else if (index > 0) {
            newSecurityCode[index - 1] = ""

            focusInput(index - 1)
        }

        onValueChange(newSecurityCode.join(""))
    }

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault()

        const copiedText = e.clipboardData.getData("text") || ""

        const allowedCopiedText = sanitizeText(copiedText, type).slice(0, length - index)

        if (!allowedCopiedText) {
            return
        }

        const newSecurityCode = [...valueArray]

        for (let i = index; i < length; i++) {
            newSecurityCode[i] = ""
        }

        allowedCopiedText.split("").forEach((item, i) => {
            const targetIndex = index + i

            if (targetIndex < length) {
                newSecurityCode[index + i] = item
            }
        })

        onValueChange(newSecurityCode.join(""))

        const nextFocusIndex = Math.min(index + allowedCopiedText.length, length - 1)

        focusInput(nextFocusIndex)
    }

    return (
        <div className={cn("space-y-3", wrapperClassName)}>
            <div className="flex flex-col-reverse group">
                <div className="flex items-center gap-x-2">

                    {valueArray.map((item, index) => (
                        <input className="flex-1 text-sm text-white w-full h-10 text-center px-3 rounded-lg border border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none" key={index} id={id} name={id} value={item} onChange={(e) => onChange(e, index)} onKeyDown={(e) => onKeyDown(e, index)} onPaste={(e) => onPaste(e, index)} type="text" disabled={disabled} maxLength={1} inputMode={inputMode} autoComplete="one-time-code" pattern={inputPattern} ref={(e) => {
                            inputRefs.current[index] = e
                        }} />
                    ))}

                </div>
                <label className={cn("font-medium block pb-3 text-white/80 group-hover:text-white transition-all group-focus-within:text-white", disabled && "group-hover:text-white/80", labelClassName)} htmlFor={id}>{label}</label>
            </div>

            {!!errorMessage && (
                <p className={cn("text-sm italic text-rose-600", errorMessageClassName)} id={`${id}-error`}>{errorMessage}</p>
            )}

        </div>
    )
}