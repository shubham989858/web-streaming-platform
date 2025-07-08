"use client"

import { Input } from "@/components/ui/input"

const HomePage = () => {
  return (
    <div className="p-10 flex flex-col gap-y-10">
      <Input label="Email" id="email" />
    </div>
  )
}

export default HomePage