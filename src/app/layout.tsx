import { Metadata } from "next"
import { Inter } from "next/font/google"

import { cn } from "@/lib/utils"
import "@/app/globals.css"
import { TRPCProvider } from "@/trpc/client"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["italic", "normal"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Web Streaming Platform",
}

type RootLayoutProps = {
  children: React.ReactNode,
}

const RootLayout = ({
  children,
}: RootLayoutProps) => {
  return (
    <html className={cn("h-full min-w-[360px] text-sm lg:text-base antialiased scheme-dark bg-black text-white", inter.className)} lang="en" suppressHydrationWarning>
      <body className="h-full antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}

export default RootLayout