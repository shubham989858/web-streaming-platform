import { trpc } from "@/trpc/server"

const ServerPage = async () => {
    const data = await trpc.articles.getAll()

    return (
        <div>{JSON.stringify(data)}</div>
    )
}

export default ServerPage