import { ResetPasswordForm } from "@/components/reset-password-form"
import { ResetPasswordPageGuard } from "@/components/reset-password-page-guard"

const ResetPasswordPage = () => {
    return (
        <ResetPasswordPageGuard>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold">Time for a Plot Reboot!</h1>
                <p className="text-zinc-400">Reset your password and get back to the action.</p>
            </div>
            <ResetPasswordForm />
        </ResetPasswordPageGuard>
    )
}

export default ResetPasswordPage