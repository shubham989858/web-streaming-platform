import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import { createTRPCRouter, subscriptionNotActiveProcedure, subscriptionRequiredProcedure } from "@/trpc/init"
import { STRIPE_SUBSCRIPTION_TRIAL_PERIOD_DAYS } from "@/constants"

export const stripeRouter = createTRPCRouter({
    createCheckoutSession: subscriptionNotActiveProcedure.mutation(async ({
        ctx,
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

        let customerId = user.stripeCustomerId

        if (!customerId) {
            const newStripeCustomer = await stripe.customers.create({
                email: user.email,
                name: user.name || "",
                metadata: {
                    clerkUserId: user.clerkUserId,
                    userId: user.id,
                },
            })

            await db.update(users).set({
                stripeCustomerId: newStripeCustomer.id,
                updatedAt: new Date(),
            }).where(eq(users.id, user.id))

            customerId = newStripeCustomer.id
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: [
                "card",
            ],
            line_items: [
                {
                    price: process.env.STRIPE_WEB_STREAMING_PLATFORM_STANDARD_PLAN_PRODUCT_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            subscription_data: !user.stripeCustomerId && user.stripeSubscriptionStatus === "none" ? {
                trial_period_days: STRIPE_SUBSCRIPTION_TRIAL_PERIOD_DAYS,
                metadata: {
                    clerkUserId: user.clerkUserId,
                    userId: user.id,
                },
            } : {
                metadata: {
                    clerkUserId: user.clerkUserId,
                    userId: user.id,
                },
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?succeed=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
        })

        return {
            url: session.url,
        }
    }),
    cancelSubscription: subscriptionRequiredProcedure.mutation(async ({
        ctx,
    }) => {
        const { user } = ctx

        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId || "")

        if (!!subscription && subscription.cancel_at_period_end) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Subscription is already scheduled to be canceled after period ends.",
            })
        }

        const canceledSubscription = await stripe.subscriptions.update(user.stripeSubscriptionId || "", {
            cancel_at_period_end: true,
        })

        await db.update(users).set({
            stripeSubscriptionStatus: canceledSubscription.status,
            stripeSubscriptionActive: canceledSubscription.status === "active" || canceledSubscription.status === "trialing",
            stripeSubscriptionExpiresAt: new Date(canceledSubscription.items?.data?.[0]?.current_period_end * 1000),
            updatedAt: new Date(),
        }).where(eq(users.id, user.id))

        return {
            success: true,
            message: "Subscription will be canceled at the end of the billing period.",
        }
    }),
})