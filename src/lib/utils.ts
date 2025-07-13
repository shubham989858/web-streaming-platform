import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes))

export const validateSecurityCode = (securityCode: string) => {
    switch ("numeric" as SecurityCodeInputType) {
        case "numeric":
            return /^\d+$/.test(securityCode)
        case "alphanumeric":
            return /^[A-Za-z0-9]+$/.test(securityCode)
        case "alphanumeric-uppercase":
            return /^[A-Z0-9]+$/.test(securityCode)
    }
}