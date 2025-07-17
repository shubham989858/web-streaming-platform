import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { HydrateClient, trpc } from "@/trpc/server"
import { AccountPageClient } from "./account-page-client"

export const dynamic = "force-dynamic"

const AccountPage = async () => {
    void trpc.users.getSignedInUser.prefetch()

    return (
        <HydrateClient>
            <Suspense fallback={<p>Loading...</p>}>
                <ErrorBoundary fallback={<p>Error...</p>}>
                    <AccountPageClient />
                </ErrorBoundary>
            </Suspense>
        </HydrateClient>
    )
}

export default AccountPage