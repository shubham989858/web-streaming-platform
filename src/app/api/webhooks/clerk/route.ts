import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"

export const POST = async (req: NextRequest) => {
    try {
        const event = await verifyWebhook(req)

        if (event.type === "user.created") {
            const { data } = event

            const [existingUser] = await db.select().from(users).where(eq(users.clerkUserId, data.id))

            if (!!existingUser) {
                return new NextResponse("User already exists.", {
                    status: 409,
                })
            }

            await db.insert(users).values({
                clerkUserId: data.id,
                name: `${data.first_name} ${data.last_name}`,
                email: data.email_addresses[0].email_address,
                imageUrl: data.image_url,
            })
        }

        if (event.type === "user.updated") {
            const { data } = event

            const [existingUser] = await db.select().from(users).where(eq(users.clerkUserId, data.id))

            if (!existingUser) {
                return new NextResponse("User not found.", {
                    status: 404,
                })
            }

            await db.update(users).set({
                name: `${data.first_name} ${data.last_name}`,
                imageUrl: data.image_url,
                updatedAt: new Date(),
            }).where(eq(users.clerkUserId, data.id))
        }

        if (event.type === "user.deleted") {
            console.log("USER UPDATE EVENT...")

            const { data } = event

            if (!data.id) {
                return new NextResponse("Missing Clerk User ID.", {
                    status: 400,
                })
            }

            const [existingUser] = await db.select().from(users).where(eq(users.clerkUserId, data.id))

            if (!existingUser) {
                return new NextResponse("User not found.", {
                    status: 404,
                })
            }

            await db.delete(users).where(eq(users.clerkUserId, data.id))
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