import { requireRole } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/user/stats-card"
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { getPlatformStats } from "@/lib/data/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const user = await requireRole("admin")
  const stats = await getPlatformStats()

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your platform</p>
        </div>

        {/* Platform Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatsCard title="Total Users" value={stats.totalUsers} description="Registered users" icon={Users} />
          <StatsCard
            title="Verified Experts"
            value={stats.totalExperts}
            description="Active expert accounts"
            icon={UserCheck}
          />
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            description="All-time bookings"
            icon={Calendar}
          />
          <StatsCard
            title="Platform Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            description="Total revenue generated"
            icon={DollarSign}
          />
          <StatsCard title="Active Users" value={stats.activeUsers} description="Currently active" icon={TrendingUp} />
          <StatsCard
            title="Pending Applications"
            value={stats.pendingApplications}
            description="Expert applications"
            icon={AlertCircle}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">John Doe joined the platform</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Expert application submitted</p>
                    <p className="text-xs text-muted-foreground">Sarah Kim applied to become an expert</p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Booking completed</p>
                    <p className="text-xs text-muted-foreground">Session between Jane and Michael completed</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/admin/users" className="block p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <p className="text-sm font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground">View and manage user accounts</p>
              </a>
              <a
                href="/admin/experts"
                className="block p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium">Verify Experts</p>
                <p className="text-xs text-muted-foreground">Review and approve expert applications</p>
              </a>
              <a
                href="/admin/bookings"
                className="block p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium">Review Bookings</p>
                <p className="text-xs text-muted-foreground">Monitor platform bookings</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
