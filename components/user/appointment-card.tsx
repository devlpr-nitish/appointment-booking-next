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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AppointmentCardProps {
    appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState("schedule_conflict")
    const [customReason, setCustomReason] = useState("")

    const handleCancel = async () => {
        setLoading(true)
        try {
            const finalReason = reason === "other" ? customReason : reason
            const result = await cancelAppointmentAction(parseInt(appointment.id), finalReason)

            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                alert(result.message || "Failed to cancel appointment")
            }
        } catch (error) {
            console.error("Failed to cancel appointment:", error)
            alert("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    const appointmentDate = new Date(appointment.date)
    // Only allow cancelling if pending (as per requirement: "once confirmed user will not be able to cancel")
    const canCancel = appointment.status === "pending"

    // Status visual: distinct colors or same? User didn't specify, but usually pending/confirmed are "upcoming" in time.
    const isUpcoming = appointment.status === "pending" || appointment.status === "confirmed"

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

            {canCancel && (
                <CardFooter>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Cancel Appointment</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to cancel? Please let us know why.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <RadioGroup value={reason} onValueChange={setReason}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="schedule_conflict" id="r1" />
                                        <Label htmlFor="r1">Schedule conflict</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="change_of_plans" id="r2" />
                                        <Label htmlFor="r2">Change of plans</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="found_another_expert" id="r3" />
                                        <Label htmlFor="r3">Found another expert</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="other" id="r4" />
                                        <Label htmlFor="r4">Other</Label>
                                    </div>
                                </RadioGroup>
                                {reason === "other" && (
                                    <div className="grid w-full gap-1.5">
                                        <Label htmlFor="message">Reason</Label>
                                        <Textarea
                                            placeholder="Type your reason here."
                                            id="message"
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Keep Appointment
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleCancel}
                                    disabled={loading || (reason === "other" && !customReason.trim())}
                                >
                                    {loading ? "Cancelling..." : "Confirm Cancellation"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            )}
        </Card>
    )
}
