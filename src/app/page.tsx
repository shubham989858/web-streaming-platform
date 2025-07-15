"use client"

import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button"

const HomePage = () => {
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (!!data.url) {
        window.location.assign(data.url)
      }
    },
    onError: (error) => {
      console.log(error.message)

      throw new Error(error.message)
    },
  })

  return (
    <div className="p-10">
      <Button size="lg" disabled={createCheckoutSession.isPending} onClick={() => createCheckoutSession.mutate()}>Demo subscribe button</Button>
    </div>
  )
}

export default HomePage