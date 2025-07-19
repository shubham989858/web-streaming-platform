import { initTRPC, TRPCError } from "@trpc/server"
import { cache } from "react"
import superjson from "superjson"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"

export const createTRPCContext = cache(async () => {
    const { userId } = await auth()

    return {
        clerkUserId: userId,
    }
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
// Avoid exporting the entire t-object
// since it"s not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
})
// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

export const protectedProcedure = baseProcedure.use(async ({
    ctx,
    next,
}) => {
    if (!ctx.clerkUserId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User is not signed in.",
        })
    }

    const [existingUser] = await db.select().from(users).where(eq(users.clerkUserId, ctx.clerkUserId))

    if (!existingUser) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Signed in user not found.",
        })
    }

    return next({
        ctx: {
            ...ctx,
            user: existingUser,
        },
    })
})

export const subscriptionRequiredProcedure = protectedProcedure.use(async ({
    ctx,
    next,
}) => {
    const { user } = ctx

    const isSubscriptionActive = user.stripeSubscriptionActive

    const isSubscriptionStatusValid = user.stripeSubscriptionStatus === "active" || user.stripeSubscriptionStatus === "trialing"

    const isNotSubscriptionExpired = !!user.stripeSubscriptionExpiresAt && new Date(user.stripeSubscriptionExpiresAt) >= new Date()

    if (!user.stripeSubscriptionId || !isSubscriptionActive || !isSubscriptionStatusValid || !isNotSubscriptionExpired) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Subscription plan is not active.",
        })
    }

    return next({
        ctx,
    })
})

export const subscriptionNotActiveProcedure = protectedProcedure.use(async ({
    ctx,
    next,
}) => {
    const { user } = ctx

    const isSubscriptionActive = user.stripeSubscriptionActive

    const isSubscriptionStatusValid = user.stripeSubscriptionStatus === "active" || user.stripeSubscriptionStatus === "trialing"

    const isNotSubscriptionExpired = !!user.stripeSubscriptionExpiresAt && new Date(user.stripeSubscriptionExpiresAt) >= new Date()

    if (!!user.stripeSubscriptionId || isSubscriptionActive || isSubscriptionStatusValid || isNotSubscriptionExpired) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Subscription plan is already active.",
        })
    }

    return next({
        ctx,
    })
})