"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { SecurityCodeInput } from "@/components/ui/security-code-input"

const SECURITY_CODE_LENGTH = 6

type SecurityCodeType = "numeric" | "alphanumeric" | "alphanumeric-uppercase"

const SECURITY_CODE_TYPE: SecurityCodeType = "alphanumeric" as SecurityCodeType

const securityCodeFormSchema = z.object({
  securityCode: z.string().nonempty({
    message: "Security code is required.",
  }).length(SECURITY_CODE_LENGTH, {
    message: `Security code must be exactly ${SECURITY_CODE_LENGTH} characters long.`,
  }).refine((value) => {
    switch (SECURITY_CODE_TYPE) {
      case "numeric":
        return /^\d+$/.test(value)
      case "alphanumeric":
        return /^[A-Za-z0-9]+$/.test(value)
      case "alphanumeric-uppercase":
        return /^[A-Z0-9]+$/.test(value)
    }
  }, {
    message: "Security code is invalid.",
  }),
})

const HomePage = () => {
  const form = useForm<z.infer<typeof securityCodeFormSchema>>({
    resolver: zodResolver(securityCodeFormSchema),
    defaultValues: {
      securityCode: "",
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return console.log(data)
  })

  const onValueChange = (value: string) => {
    form.setValue("securityCode", value, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  console.log(form.watch("securityCode"))

  return (
    <div className="p-10">
      <form className="space-y-4" onSubmit={onSubmit}>
        <SecurityCodeInput label="Security code" id="securityCode" type="alphanumeric-uppercase" length={6} value={form.watch("securityCode")} onValueChange={onValueChange} errorMessage={form.formState.errors.securityCode?.message} disabled={form.formState.isSubmitting} />
        <Button type="submit" disabled={form.formState.isSubmitting}>

          {form.formState.isSubmitting ? (
            <IconLoader2 className="animate-spin transition-all size-5" />
          ) : (
            "Submit"
          )}

        </Button>
      </form>
    </div>
  )
}

export default HomePage