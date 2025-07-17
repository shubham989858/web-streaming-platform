import { createTRPCRouter } from "@/trpc/init"
import { stripeRouter } from "@/trpc/routers/stripe"
import { usersRouter } from "@/trpc/routers/users"

export const appRouter = createTRPCRouter({
    users: usersRouter,
    stripe: stripeRouter,
})

export type AppRouter = typeof appRouter