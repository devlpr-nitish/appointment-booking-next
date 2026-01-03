import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ExpertDashboardHeader } from "@/components/expert/expert-dashboard-header"
import { AvailabilityClient } from "@/components/expert/availability-client"
import { getExpertProfile } from "@/lib/data/expert-profile"
import { cookies } from "next/headers"

export default async function AvailabilityPage() {
    const user = await requireAuth()

    // Redirect non-experts
    if (user.role !== "expert" && !user.isExpert) {
        redirect("/dashboard")
    }

    // Verify expert profile exists
    const expertProfile = await getExpertProfile(user.id)
    if (!expertProfile) {
        redirect("/become-expert")
    }

    return (
        <div className="min-h-screen bg-background">
            <ExpertDashboardHeader user={user} />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <AvailabilityClient />
            </main>
        </div>
    )
}
