import { requireAuth } from "@/lib/auth"
import { UserProfileView } from "@/components/profile/user-profile-view"
import { DashboardHeader } from "@/components/user/dashboard-header"

export default async function ProfilePage() {
    const user = await requireAuth()

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={user} />
            <UserProfileView user={user} />
        </div>
    )
}
