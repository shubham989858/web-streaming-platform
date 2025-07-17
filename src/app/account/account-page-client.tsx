"use client"

import Image from "next/image"

import { trpc } from "@/trpc/client"

export const AccountPageClient = () => {
    const [signedInUser] = trpc.users.getSignedInUser.useSuspenseQuery()

    return (
        <div className="p-10 space-y-4">
            <p>ID: {signedInUser.id}</p>
            <p>Clerk User ID: {signedInUser.clerkUserId}</p>
            <p>Name: {signedInUser.name}</p>
            <p>Email: {signedInUser.email}</p>
            <p>Image:</p>
            <Image className="size-[6.25rem] rounded-full object-cover" src={signedInUser.imageUrl || ""} alt="User image" width={100} height={100} loading="eager" priority />
            <p>Stripe Customer ID: {signedInUser.stripeCustomerId}</p>
            <p>Stripe Subscription Active: {signedInUser.stripeSubscriptionActive}</p>
            <p>Stripe Subscription ID: {signedInUser.stripeSubscriptionId}</p>
            <p>Stripe Subscription Status: {signedInUser.stripeSubscriptionStatus}</p>
            <p>Stripe Subscription Expires At: {signedInUser.stripeSubscriptionExpiresAt?.toString()}</p>
            <p>Created At: {signedInUser.createdAt.toString()}</p>
            <p>Updated At: {signedInUser.updatedAt.toString()}</p>
        </div>
    )
}