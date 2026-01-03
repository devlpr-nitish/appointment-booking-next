import { Card } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AppointmentCard } from "@/components/dashboard/appointment-card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { getUserBookingsAction } from "@/app/actions/user"

export default async function DashboardPage() {
    const user = await requireAuth()

    // Redirect experts to their dashboard
    if (user.role === "expert" || user.isExpert) {
        redirect("/expert")
    }

    // Redirect admins to admin dashboard
    if (user.role === "admin") {
        redirect("/admin")
    }

    const { data: bookings = [] } = await getUserBookingsAction()

    // Process bookings
    // Backend doesn't sort by status group, so we do it here
    const upcomingAppointments = bookings.filter((b: any) =>
        b.status === "confirmed" || b.status === "pending" || b.status === "upcoming"
    )

    const pastAppointments = bookings.filter((b: any) =>
        b.status === "completed" || b.status === "cancelled"
    )

    // Calculate total spent only on confirmed/completed bookings
    const totalSpent = bookings
        .filter((b: any) => b.status === "confirmed" || b.status === "completed")
        .reduce((sum: number, appt: any) => sum + (appt.total_price || appt.price || 0), 0)

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={user} />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
                    <p className="text-muted-foreground">Manage your appointments and track your learning journey</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatsCard
                        title="Upcoming Sessions"
                        value={upcomingAppointments.length}
                        description="Scheduled appointments"
                        icon={Calendar}
                    />
                    <StatsCard
                        title="Completed Sessions"
                        value={pastAppointments.filter((b: any) => b.status === "completed").length}
                        description="Total sessions attended"
                        icon={Clock}
                    />
                    <StatsCard
                        title="Total Spent"
                        value={`$${totalSpent.toFixed(2)}`}
                        description="Investment in learning"
                        icon={DollarSign}
                    />
                    <StatsCard
                        title="Active Bookings"
                        value={bookings.length}
                        description="All time bookings"
                        icon={TrendingUp}
                    />
                </div>

                {/* Upcoming Appointments */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                        <Button asChild>
                            <Link href="/experts">Book New Session</Link>
                        </Button>
                    </div>

                    {upcomingAppointments.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {upcomingAppointments.map((appointment: any) => (
                                <AppointmentCard key={appointment.id} appointment={{
                                    ...appointment,
                                    expertName: appointment.expert?.user?.name || "Expert",
                                    expertImage: appointment.expert?.user?.image || "/placeholder-user.jpg",
                                    expertExpertise: appointment.expert?.specializations?.[0] || "General",
                                    date: appointment.booking_date,
                                    time: appointment.start_time,
                                    price: appointment.total_price || 0,
                                    duration: 60 // Should calculate from start/end
                                }} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground mb-4">You don&apos;t have any upcoming sessions</p>
                            <Button asChild>
                                <Link href="/experts">Find an Expert</Link>
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Past Sessions</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {pastAppointments.slice(0, 4).map((appointment: any) => (
                                <AppointmentCard key={appointment.id} appointment={{
                                    ...appointment,
                                    expertName: appointment.expert?.user?.name || "Expert",
                                    expertImage: appointment.expert?.user?.image || "/placeholder-user.jpg",
                                    expertExpertise: appointment.expert?.specializations?.[0] || "General",
                                    date: appointment.booking_date,
                                    time: appointment.start_time,
                                    price: appointment.total_price || 0,
                                    duration: 60
                                }} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
