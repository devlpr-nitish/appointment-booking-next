"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, XCircle } from "lucide-react"
import Image from "next/image"
import type { Appointment } from "@/lib/data/appointments"
import { format } from "date-fns"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cancelAppointmentAction } from "@/app/actions/user"

interface AppointmentCardProps {
    appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return

        setLoading(true)
        try {
            const result = await cancelAppointmentAction(parseInt(appointment.id)) // Assuming id is number-string

            if (result.success) {
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to cancel appointment:", error)
        } finally {
            setLoading(false)
        }
    }

    const appointmentDate = new Date(appointment.date)
    const isUpcoming = appointment.status === "upcoming"

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                            <Image
                                src={appointment.expertImage || "/placeholder.svg"}
                                alt={appointment.expertName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{appointment.expertName}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.expertExpertise}</p>
                        </div>
                    </div>
                    <Badge variant={isUpcoming ? "default" : "secondary"}>{appointment.status}</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(appointmentDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {appointment.time} ({appointment.duration} minutes)
                    </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm font-medium">${appointment.price}</span>
                    {appointment.meetingLink && (
                        <Button size="sm" variant="outline" asChild>
                            <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="mr-2 h-4 w-4" />
                                Join Meeting
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>

            {isUpcoming && (
                <CardFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full bg-transparent"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        {loading ? "Cancelling..." : "Cancel Appointment"}
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}
