"use client"

import { IconLoader2 } from "@tabler/icons-react"

import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button"

const HomePage = () => {
  const cancelSubscription = trpc.stripe.cancelSubscription.useMutation({
    onSuccess: (data) => {
      if (data.success && !!data.message) {
        console.log(data.message)
      }
    },
    onError: (error) => {
      console.log(error.message)

      throw new Error(error.message)
    },
  })

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
      <Button size="lg" disabled={createCheckoutSession.isPending} onClick={() => createCheckoutSession.mutate()}>

        {createCheckoutSession.isPending ? (
          <IconLoader2 className="size-6 animate-spin" />
        ) : (
          "Demo subscribe button"
        )}

      </Button>
      <Button size="lg" disabled={cancelSubscription.isPending} onClick={() => cancelSubscription.mutate()}>

        {cancelSubscription.isPending ? (
          <IconLoader2 className="size-6 animate-spin" />
        ) : (
          "Demo cancel subscription button"
        )}

      </Button>
    </div>
  )
}

export default HomePage