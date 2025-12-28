"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlotPicker } from "./time-slot-picker"
import { format } from "date-fns"
import type { Expert } from "@/lib/data/experts"
import type { TimeSlot } from "@/lib/data/bookings"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createBookingAction } from "@/app/actions/booking"

interface BookingInterfaceProps {
    expert: Expert
}

export function BookingInterface({ expert }: BookingInterfaceProps) {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [slots, setSlots] = useState<TimeSlot[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (date) {
            // Fetch available slots
            const dateStr = format(date, "yyyy-MM-dd")
            fetch(`/api/bookings/slots?expertId=${expert.id}&date=${dateStr}`)
                .then((res) => res.json())
                .then((data: { slots: TimeSlot[] }) => setSlots(data.slots || []))
                .catch(() => setError("Failed to load available slots"))
        }
    }, [date, expert.id])

    const handleBook = async () => {
        if (!date || !selectedTime) return

        setLoading(true)
        setError("")

        try {
            const selectedSlot = slots.find(s => s.time === selectedTime)
            if (!selectedSlot?.id) {
                setError("Invalid time slot")
                setLoading(false)
                return
            }

            const result = await createBookingAction(parseInt(expert.id), selectedSlot.id)

            if (!result.success) {
                setError(result.message || "Booking failed")
                return
            }

            // Redirect to dashboard or success page
            router.push("/dashboard")
            router.refresh()
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>
                        Time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0">
                            <h3 className="text-sm font-medium mb-3">Select a Date</h3>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                                className="rounded-md border"
                            />
                        </div>

                        {date && (
                            <div className="flex-1">
                                <h3 className="text-sm font-medium mb-3">Select a Time</h3>
                                <TimeSlotPicker slots={slots} selectedTime={selectedTime} onSelectTime={setSelectedTime} />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {date && selectedTime && (
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-muted rounded-lg mb-6">
                            <div className="grid gap-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Expert</span>
                                    <span className="font-medium">{expert.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time</span>
                                    <span className="font-medium">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Duration</span>
                                    <span className="font-medium">60 minutes</span>
                                </div>
                                <div className="border-t my-2 pt-2 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${expert.hourlyRate}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                            onClick={handleBook}
                            disabled={!date || !selectedTime || loading}
                        >
                            {loading ? "Confirming..." : "Confirm Booking"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
