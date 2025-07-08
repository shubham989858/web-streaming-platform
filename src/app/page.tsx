"use client"

import { useState } from "react"

import { PasswordInput } from "@/components/ui/password-input"

const HomePage = () => {
  const [hidden, setHidden] = useState(true)

  return (
    <div className="p-10 flex flex-col gap-y-10">
      <PasswordInput label="Password" id="password" hidden={hidden} onEyeClick={() => setHidden((prev) => prev === true ? false : true)} errorMessage="Password is required." />
    </div>
  )
}

export default HomePage