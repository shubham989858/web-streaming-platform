import { Logo } from "@/components/logo"
import { AuthVariantLink } from "@/components/auth-variant-link"

export const AuthHeader = () => {
    return (
        <header className="py-6 px-6 md:px-16 lg:px-26 flex items-center justify-between gap-x-10">
            <Logo />
            <AuthVariantLink />
        </header>
    )
}