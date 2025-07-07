"use client"

import { IconPlayerPlayFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

const HomePage = () => {
  return (
    <div className="p-10 flex flex-col gap-y-10">
      <Button>Button</Button>
      <Button>
        <IconPlayerPlayFilled className="size-4" />
        Play
      </Button>
      <Button size="sm">Button</Button>
      <Button size="lg">Button</Button>
      <Button variant="primary">Button</Button>
      <Button iconOnly>
        <IconPlayerPlayFilled className="size-5" />
      </Button>
    </div>
  )
}

export default HomePage