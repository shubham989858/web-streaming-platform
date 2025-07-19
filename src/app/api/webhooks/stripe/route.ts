import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { eq } from "drizzle-orm"

import { stripe } from "@/lib/stripe"
import { db } from "@/db"
import { users } from "@/db/schema"

export const config = {
    api: {
        bodyParser: false,
    },
}

export const POST = async (req: NextRequest) => {
    try {
        const body = Buffer.from(await req.arrayBuffer())

        const signature = (await headers()).get("stripe-signature") as string

        const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session

            const customerId = session.customer as string

            const subscriptionId = session.subscription as string

            const subscription = await stripe.subscriptions.retrieve(subscriptionId)

            const [existingUser] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId))

            if (!existingUser) {
                return new NextResponse("User not found.", {
                    status: 404,
                })
            }

            await db.update(users).set({
                stripeSubscriptionId: subscriptionId,
                stripeSubscriptionActive: subscription.status === "active" || subscription.status === "trialing",
                stripeSubscriptionStatus: subscription.status,
                stripeSubscriptionExpiresAt: new Date(subscription.items?.data?.[0]?.current_period_end * 1000),
                updatedAt: new Date(),
            }).where(eq(users.id, existingUser.id))
        }

        if (event.type === "customer.subscription.created") {
            const subscription = event.data.object as Stripe.Subscription

            const customerId = subscription.customer as string

            const [existingUser] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId))

            if (!existingUser) {
                return new NextResponse("User not found.", {
                    status: 404,
                })
            }

            await db.update(users).set({
                stripeSubscriptionId: subscription.id,
                stripeSubscriptionActive: subscription.status === "active" || subscription.status === "trialing",
                stripeSubscriptionStatus: subscription.status,
                stripeSubscriptionExpiresAt: new Date(subscription.items?.data?.[0]?.current_period_end * 1000),
                updatedAt: new Date(),
            }).where(eq(users.id, existingUser.id))
        }

        if (event.type === "customer.subscription.updated") {
            const subscription = event.data.object as Stripe.Subscription

            const customerId = subscription.customer as string

            const [existingUser] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId))

            if (!existingUser) {
                return new NextResponse("User not found.", {
                    status: 404,
                })
            }

            await db.update(users).set({
                stripeSubscriptionActive: subscription.status === "active" || subscription.status === "trialing",
                stripeSubscriptionStatus: subscription.status,
                stripeSubscriptionExpiresAt: new Date(subscription.items?.data?.[0]?.current_period_end * 1000),
                updatedAt: new Date(),
            }).where(eq(users.id, existingUser.id))
        }

        if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object as Stripe.Subscription

            const customerId = subscription.customer as string

            const [existingUser] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId))

            if (!existingUser) {
                return new NextResponse("User not found.", {
                    status: 404,
                })
            }

            await db.update(users).set({
                stripeSubscriptionId: null,
                stripeSubscriptionStatus: subscription.status as any,
                stripeSubscriptionActive: false,
                stripeSubscriptionExpiresAt: null,
                updatedAt: new Date(),
            }).where(eq(users.id, existingUser.id))
        }

        return new NextResponse("Webhook received.", {
            status: 200,
        })
    } catch (error) {
        console.log("Error occurred while verifying webhook.")

        console.log(error)

        return new NextResponse("Error occurred while verifying webhook.", {
            status: 400,
        })
    }
}