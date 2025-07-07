import { db } from "@/db"
import { articles } from "@/db/schema"

const HomePage = async () => {
  const allArticles = await db.select().from(articles)

  return (
    <div>{JSON.stringify(allArticles)}</div>
  )
}

export default HomePage