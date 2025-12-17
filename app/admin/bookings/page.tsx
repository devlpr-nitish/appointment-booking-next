import { requireRole } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { mockAppointments } from "@/lib/data/appointments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function AdminBookingsPage() {
    const user = await requireRole("admin")
    const bookings = mockAppointments

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader user={user} />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Booking Management</h1>
                    <p className="text-muted-foreground">Monitor all platform bookings</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Bookings ({bookings.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expert</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expertise</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/50">
                                            <td className="py-3 px-4 text-sm font-medium">{booking.expertName}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">{booking.expertExpertise}</td>
                                            <td className="py-3 px-4 text-sm">{format(new Date(booking.date), "MMM d, yyyy")}</td>
                                            <td className="py-3 px-4 text-sm">{booking.time}</td>
                                            <td className="py-3 px-4 text-sm">{booking.duration}m</td>
                                            <td className="py-3 px-4 text-sm font-medium">${booking.price}</td>
                                            <td className="py-3 px-4">
                                                <Badge
                                                    variant={
                                                        booking.status === "upcoming"
                                                            ? "default"
                                                            : booking.status === "completed"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
