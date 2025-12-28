import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/providers/session-provider"
import { getSession } from "@/lib/auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nexus - Book 1-on-1 Sessions with Verified Experts",
  description:
    "Connect with verified professionals for personalized guidance. Get expert advice on business, technology, design, and more.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSession()

  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <SessionProvider user={user}>
          {children}
          <Toaster />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
}
