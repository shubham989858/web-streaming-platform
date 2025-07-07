import { createTRPCRouter } from "@/trpc/init"
import { articlesRouter } from "@/trpc/routers/articles"

export const appRouter = createTRPCRouter({
    articles: articlesRouter,
})

export type AppRouter = typeof appRouter