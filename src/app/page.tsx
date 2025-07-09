"use client"

import React, { useState, useRef } from "react"

const HomePage = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))

  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  console.log(otp.join(""))

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "")

    if (!value) {
      return
    }

    const next = [...otp]

    next[index] = value[0]

    setOtp(next)

    if (index < 5) {
      inputsRef.current[index + 1]?.focus()

      inputsRef.current[index + 1]?.select()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== "Backspace") {
      return
    }

    e.preventDefault()

    const next = [...otp]

    if (!!otp[index]) {
      next[index] = ""

      setOtp(next)
    } else if (index > 0) {
      inputsRef.current[index - 1]?.focus()

      inputsRef.current[index - 1]?.select()

      next[index - 1] = ""

      setOtp(next)
    }
  }

  return (
    <div className="p-10">
      <div className="max-w-md">
        <div className="grid grid-cols-6 gap-x-2">

          {otp.map((item, index) => (
            <input className="h-10 px-3 rounded-lg border border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-center" key={index} ref={(element: HTMLInputElement | null) => {
              inputsRef.current[index] = element
            }} type="text" disabled={false} value={item} onChange={(e) => onChange(e, index)} onKeyDown={(e) => onKeyDown(e, index)} inputMode="numeric" pattern="\d*" maxLength={1} />
          ))}

        </div>
      </div>
    </div>
  )
}

export default HomePage