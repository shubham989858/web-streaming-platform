import { boolean, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const usersStripeSubscriptionStatusEnum = pgEnum("users_stripe_subscription_status_enum", ["none", "incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"])

export const users = pgTable("users", {
    id: text("id").primaryKey().notNull().unique().$defaultFn(() => createId()),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    name: text("name"),
    email: text("email").notNull().unique(),
    imageUrl: text("image_url"),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripeSubscriptionActive: boolean("stripe_subscription_active").notNull().default(false),
    stripeSubscriptionStatus: usersStripeSubscriptionStatusEnum("stripe_subscription_status").notNull().default("none"),
    stripeSubscriptionExpiresAt: timestamp("stripe_subscription_expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
    uniqueIndex("clerk_user_id_index").on(t.clerkUserId),
    uniqueIndex("email_index").on(t.email),
    uniqueIndex("stripe_customer_id_index").on(t.stripeCustomerId),
    uniqueIndex("stripe_subscription_id_index").on(t.stripeSubscriptionId),
])