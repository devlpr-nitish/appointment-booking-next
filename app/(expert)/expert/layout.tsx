import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ExpertDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireAuth()

    // Redirect non-experts (allow admin)
    if (user.role !== "expert" && !user.isExpert && user.role !== "admin") {
        redirect("/user")
    }

    return <>{children}</>
}
