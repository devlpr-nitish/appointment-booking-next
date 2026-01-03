"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlotPicker } from "./time-slot-picker"
import { format } from "date-fns"
import type { Expert } from "@/lib/data/experts"
import type { TimeRange } from "@/lib/data/bookings"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createBookingAction, getAvailableSlotsAction } from "@/app/actions/booking"

interface BookingInterfaceProps {
    expert: Expert
}

export function BookingInterface({ expert }: BookingInterfaceProps) {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState<string>("")
    const [endTime, setEndTime] = useState<string>("")
    const [availableRanges, setAvailableRanges] = useState<TimeRange[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (date) {
            const controller = new AbortController()
            setLoadingSlots(true)
            setError("")
            setStartTime("")
            setEndTime("")

            const dateStr = format(date, "yyyy-MM-dd")
            getAvailableSlotsAction(parseInt(expert.id), dateStr)
                .then((result) => {
                    if (result.success) {
                        setAvailableRanges(result.data.slots || [])
                    } else {
                        setError(result.message)
                        setAvailableRanges([])
                    }
                    setLoadingSlots(false)
                })
                .catch(() => {
                    setError("Failed to load available slots")
                    setAvailableRanges([])
                    setLoadingSlots(false)
                })

            return () => controller.abort()
        }
    }, [date, expert.id])

    const handleBook = async () => {
        if (!date || !startTime || !endTime) return

        setLoading(true)
        setError("")

        try {
            const dateStr = format(date, "yyyy-MM-dd")
            const result = await createBookingAction(parseInt(expert.id), dateStr, startTime, endTime)

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
                            <div className="inline-block bg-background rounded-lg border shadow-sm">
                                <Calendar
                                    mode="single"
                                    date={date}
                                    onSelect={setDate}
                                    disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium mb-3">
                                {date ? `Available Times for ${format(date, "MMM d, yyyy")}` : "Select a Date First"}
                            </h3>
                            {date ? (
                                <TimeSlotPicker
                                    availableRanges={availableRanges}
                                    startTime={startTime}
                                    endTime={endTime}
                                    onTimeChange={(start, end) => {
                                        setStartTime(start)
                                        setEndTime(end)
                                    }}
                                    isLoading={loadingSlots}
                                />
                            ) : (
                                <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/30">
                                    Please select a date to view available time slots
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {date && startTime && endTime && (
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
                                    <span className="font-medium">{startTime} - {endTime}</span>
                                </div>

                                <div className="border-t my-2 pt-2 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${(() => {
                                        const start = parseInt(startTime.split(':')[0]) + parseInt(startTime.split(':')[1]) / 60
                                        const end = parseInt(endTime.split(':')[0]) + parseInt(endTime.split(':')[1]) / 60
                                        const duration = end - start
                                        return (duration * expert.hourlyRate).toFixed(2)
                                    })()}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                            onClick={handleBook}
                            disabled={!date || !startTime || !endTime || loading}
                        >
                            {loading ? "Requesting..." : "Request Booking"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div >
    )
}
