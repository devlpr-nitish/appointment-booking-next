import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ExpertDashboardHeader } from "@/components/expert/expert-dashboard-header"
import { AvailabilityClient } from "@/components/expert/availability-client"
import { getExpertProfile } from "@/lib/data/expert-profile"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AvailabilityPage() {
    const user = await requireAuth()

    // Redirect non-experts
    if (user.role !== "expert" && !user.isExpert) {
        redirect("/dashboard")
    }

    // Verify expert profile exists
    const expertProfile = await getExpertProfile(user.id)
    if (!expertProfile) {
        return (
            <div className="min-h-screen bg-background">
                <ExpertDashboardHeader user={user} />
                <main className="container mx-auto px-4 py-8 max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Complete Your Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">You need to complete your expert profile to access availability settings.</p>
                            <Button asChild>
                                <Link href="/become-expert">Setup Profile</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
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
