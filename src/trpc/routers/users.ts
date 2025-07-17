import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

export const usersRouter = createTRPCRouter({
    getSignedInUser: protectedProcedure.query(async ({
        ctx,
    }) => {
        const { user } = ctx

        return user
    }),
})