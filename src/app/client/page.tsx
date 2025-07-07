import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { HydrateClient, trpc } from "@/trpc/server"
import { TempClient } from "@/app/client/temp-client"

export const dynamic = "force-dynamic"

const ClientPage = async () => {
    void trpc.hello.prefetch({
        text: "Shubham",
    })

    return (
        <HydrateClient>
            <Suspense fallback={<p>Loading...</p>}>
                <ErrorBoundary fallback={<p>Error...</p>}>
                    <TempClient />
                </ErrorBoundary>
            </Suspense>
        </HydrateClient>
    )
}

export default ClientPage