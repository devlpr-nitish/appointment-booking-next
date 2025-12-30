import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ExpertProfileView } from "@/components/profile/expert-profile-view"
import { UserProfileView } from "@/components/profile/user-profile-view"

export default async function ProfilePage() {
    const user = await requireAuth()

    console.log('user', user);
    

    // Redirect based on role
    if (user.role === "expert") {
        return <ExpertProfileView userId={user.id} />
    }

    return <UserProfileView user={user} />
}
