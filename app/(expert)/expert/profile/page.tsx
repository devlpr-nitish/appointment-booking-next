import { requireAuth } from "@/lib/auth"
import { ExpertDashboardHeader } from "@/components/expert/expert-dashboard-header"
import { ExpertProfileView } from "@/components/profile/expert-profile-view"

export default async function ExpertProfilePage() {
    const user = await requireAuth()

    return (
        <div className="min-h-screen bg-background">
            <ExpertDashboardHeader user={user} />
            <ExpertProfileView userId={user.id} />
        </div>
    )
}
