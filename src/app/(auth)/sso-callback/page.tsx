import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { IconLoader2 } from "@tabler/icons-react"

import { SSOCallbackPageGuard } from "@/components/sso-callback-page-guard"

const SSOCallbackPage = () => {
    return (
        <SSOCallbackPageGuard>
            <AuthenticateWithRedirectCallback />
            <div className="hidden" id="clerk-captcha" />
            <IconLoader2 className="mx-auto size-8 animate-spin" />
        </SSOCallbackPageGuard>
    )
}

export default SSOCallbackPage