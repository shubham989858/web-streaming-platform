import { AuthHeader } from "@/components/auth-header"

type AuthLayoutProps = {
    children: React.ReactNode,
}

const AuthLayout = ({
    children,
}: AuthLayoutProps) => {
    return (
        <div className="h-full flex flex-col">
            <AuthHeader />
            <div className="flex-1 flex items-center justify-center py-10 px-6 md:px-16 lg:px-26">
                <div className="w-full md:max-w-md space-y-6">{children}</div>
            </div>
        </div>
    )
}

export default AuthLayout