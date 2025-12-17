import { requireAuth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppointmentCard } from "@/components/dashboard/appointment-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUpcomingAppointments, getPastAppointments } from "@/lib/data/appointments"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AppointmentsPage() {
  const user = await requireAuth()
  const upcomingAppointments = await getUpcomingAppointments(user.id)
  const pastAppointments = await getPastAppointments(user.id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Sessions</h1>
            <p className="text-muted-foreground">View and manage all your appointments</p>
          </div>
          <Button asChild>
            <Link href="/experts">Book New Session</Link>
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                <Button asChild>
                  <Link href="/experts">Find an Expert</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No past sessions yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
