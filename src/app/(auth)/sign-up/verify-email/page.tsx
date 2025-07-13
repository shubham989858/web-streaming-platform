import { EmailVerificationForm } from "@/components/email-verification-form"
import { VerifyEmailPageGuard } from "@/components/verify-email-page-guard"

const VerifyEmailPage = () => {
    return (
        <VerifyEmailPageGuard>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold">Cue the Lights!</h1>
                <p className="text-zinc-400">Enter the code we sent to unlock the stream.</p>
            </div>
            <EmailVerificationForm />
        </VerifyEmailPageGuard>
    )
}

export default VerifyEmailPage