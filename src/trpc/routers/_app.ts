import { createTRPCRouter } from "@/trpc/init"
import { stripeRouter } from "@/trpc/routers/stripe"

export const appRouter = createTRPCRouter({
    stripe: stripeRouter,
})

export type AppRouter = typeof appRouter