import { trpc } from "@/trpc/server"

const ServerPage = async () => {
    const data = await trpc.hello({
        text: "Shubham",
    })

    return (
        <div>{data.greeting}</div>
    )
}

export default ServerPage