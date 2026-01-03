import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireAuth()

    // Redirect experts to their dashboard
    if (user.role === "expert" || user.isExpert) {
        redirect("/expert")
    }

    // Admin and User allowed
    return <>{children}</>
}
