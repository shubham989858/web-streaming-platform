import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

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
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?succeed=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
        })

        return {
            url: session.url,
        }
    }),
})