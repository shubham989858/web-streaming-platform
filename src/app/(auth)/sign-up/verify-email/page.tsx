import { EmailVerificationForm } from "@/components/email-verification-form"

const VerifyEmailPage = () => {
    return (
        <>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold">Cue the Lights!</h1>
                <p className="text-zinc-400">Enter the code we sent to unlock the stream.</p>
            </div>
            <EmailVerificationForm />
        </>
    )
}

export default VerifyEmailPage