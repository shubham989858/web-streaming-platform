import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import { createTRPCRouter, protectedProcedure, subscriptionRequiredProcedure } from "@/trpc/init"
import { STRIPE_SUBSCRIPTION_TRIAL_PERIOD_DAYS } from "@/constants"

export const stripeRouter = createTRPCRouter({
    createCheckoutSession: protectedProcedure.mutation(async ({
        ctx,
    }) => {
        const { user } = ctx

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
            subscription_data: {
                trial_period_days: STRIPE_SUBSCRIPTION_TRIAL_PERIOD_DAYS,
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