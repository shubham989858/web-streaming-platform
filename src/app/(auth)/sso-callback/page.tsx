import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { IconLoader2 } from "@tabler/icons-react"

import { SSOCallbackPageGuard } from "@/components/sso-callback-page-guard"

const SSOCallbackPage = () => {
    return (
        <SSOCallbackPageGuard>
            <AuthenticateWithRedirectCallback />
            <IconLoader2 className="mx-auto size-8 transition-all animate-spin" />
        </SSOCallbackPageGuard>
    )
}

export default SSOCallbackPage