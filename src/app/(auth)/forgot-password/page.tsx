import { RequestPasswordResetForm } from "@/components/request-password-reset-form"

const ForgotPasswordPage = () => {
    return (
        <>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold">Playtime again!</h1>
                <p className="text-zinc-400">Sign in to keep the show rolling.</p>
            </div>
            <RequestPasswordResetForm />
        </>
    )
}

export default ForgotPasswordPage