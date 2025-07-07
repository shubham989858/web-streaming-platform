"use client"

import { trpc } from "@/trpc/client"

export const TempClient = () => {
    const [data] = trpc.articles.getAll.useSuspenseQuery()

    return (
        <div>{JSON.stringify(data)}</div>
    )
}