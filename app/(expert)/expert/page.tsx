import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ExpertDashboardHeader } from "@/components/expert/expert-dashboard-header"
import { StatsCard } from "@/components/user/stats-card"
import { Calendar, DollarSign, Star, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getExpertProfile, getExpertStats } from "@/lib/data/expert-profile"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import { ExpertDashboardLoading } from "@/components/expert/expert-dashboard-loading"
import { getExpertBookings } from "@/app/actions/booking-actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExpertBookingsList } from "@/components/expert/expert-bookings-list"
async function ExpertDashboardContent({ userId, user }: { userId: string, user: any }) {
  const expertProfile = await getExpertProfile(userId)
  console.log(expertProfile)
  
  if (!expertProfile) {
    return (
      <div className="min-h-screen bg-background">
        <ExpertDashboardHeader user={user} />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You need to complete your expert profile to access the dashboard.</p>
              <Button asChild>
                <Link href="/become-expert">Setup Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const stats = await getExpertStats(expertProfile.id)
  const bookings = await getExpertBookings()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Expert Dashboard</h1>
          {expertProfile.verified && <Badge className="bg-primary">Verified</Badge>}
        </div>
        <p className="text-muted-foreground">Manage your sessions and track your earnings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          description="Lifetime earnings"
          icon={DollarSign}
        />
        <StatsCard
          title="Upcoming Sessions"
          value={stats.upcomingSessions}
          description="Scheduled appointments"
          icon={Calendar}
        />
        <StatsCard
          title="Completed Sessions"
          value={stats.completedSessions}
          description="Total sessions given"
          icon={Clock}
        />
        <StatsCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          description={`Based on ${stats.completedSessions} reviews`}
          icon={Star}
        />
      </div>

      {/* Profile Overview */}
      {/* <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expertise</p>
              <p className="text-lg">{expertProfile.expertise}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
              <p className="text-lg">${expertProfile.hourlyRate}/hr</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bio</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{expertProfile.bio}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.pendingRequests > 0 ? (
              <div>
                <p className="text-2xl font-bold mb-2">{stats.pendingRequests}</p>
                <p className="text-sm text-muted-foreground">New booking requests awaiting your response</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No pending requests</p>
            )}
          </CardContent>
        </Card>
      </div> */}

      {/* Bookings Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Bookings</h2>
        <ExpertBookingsList bookings={bookings} />
      </div>

    </main>
  )
}

export default async function ExpertDashboardPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <ExpertDashboardHeader user={user} />

      <Suspense fallback={<ExpertDashboardLoading />}>
        <ExpertDashboardContent userId={user.id} user={user} />
      </Suspense>
    </div>
  )
}
