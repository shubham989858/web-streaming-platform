import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"

type LogoProps = {
    className?: string,
}

export const Logo = ({
    className = "",
}: LogoProps) => {
    return (
        <Link className={cn("block w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-background", className)} href="/">
            <Image className="w-50 h-10 object-cover" src="/images/logo.svg" alt="Logo" width={200} height={40} quality={100} priority loading="eager" />
        </Link>
    )
}