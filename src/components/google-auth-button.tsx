"use client"

import { FcGoogle } from "react-icons/fc"
import { IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

type GoogleAuthButtonProps = {
    disabled: boolean,
    onClick: () => void,
    showSpinner: boolean,
}

export const GoogleAuthButton = ({
    disabled,
    onClick,
    showSpinner,
}: GoogleAuthButtonProps) => {
    return (
        <Button className="w-full" size="lg" type="button" disabled={disabled} onClick={onClick}>

            {showSpinner ? (
                <IconLoader2 className="size-6 animate-spin transition-all" />
            ) : (
                <>
                    <FcGoogle className="size-6" />
                    Google
                </>
            )
            }

        </Button >
    )
}