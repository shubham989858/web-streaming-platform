import { db } from "@/db"
import { articles } from "@/db/schema"
import { createTRPCRouter, baseProcedure } from "@/trpc/init"

export const articlesRouter = createTRPCRouter({
    getAll: baseProcedure.query(async () => {
        const allArticles = await db.select().from(articles)

        return allArticles
    })
})