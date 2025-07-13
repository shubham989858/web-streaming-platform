import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { IconLoader2 } from "@tabler/icons-react"

const SSOCallbackPage = () => {
    return (
        <>
            <AuthenticateWithRedirectCallback />
            <IconLoader2 className="mx-auto size-8 transition-all animate-spin" />
        </>
    )
}

export default SSOCallbackPage