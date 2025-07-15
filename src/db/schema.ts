import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const users = pgTable("users", {
    id: text("id").primaryKey().notNull().unique().$defaultFn(() => createId()),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    name: text("name"),
    email: text("email").notNull().unique(),
    imageUrl: text("image_url"),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
    uniqueIndex("clerk_user_id_index").on(t.clerkUserId),
    uniqueIndex("email_index").on(t.email),
])