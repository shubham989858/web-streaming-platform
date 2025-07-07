import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const articles = pgTable("articles", {
    id: text("id").primaryKey().notNull().unique().$defaultFn(() => createId()),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
    index("title_index").on(t.title),
])