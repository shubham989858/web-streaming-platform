import { RequestPasswordResetForm } from "@/components/request-password-reset-form"

const ForgotPasswordPage = () => {
    return (
        <>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold">Lost your Ticket?</h1>
                <p className="text-zinc-400">Enter your email and we’ll send a code to get you back in.</p>
            </div>
            <RequestPasswordResetForm />
        </>
    )
}

export default ForgotPasswordPage