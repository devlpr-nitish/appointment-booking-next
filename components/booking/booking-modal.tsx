"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlotPicker } from "./time-slot-picker"
import { format } from "date-fns"
import type { Expert } from "@/lib/data/experts"
import type { TimeSlot } from "@/lib/data/bookings"
import { useRouter } from "next/navigation"

interface BookingModalProps {
    expert: Expert
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookingModal({ expert, open, onOpenChange }: BookingModalProps) {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [slots, setSlots] = useState<TimeSlot[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (date && open) {
            // Fetch available slots
            const dateStr = format(date, "yyyy-MM-dd")
            fetch(`/api/bookings/slots?expertId=${expert.id}&date=${dateStr}`)
                .then((res) => res.json())
                .then((data: { slots: TimeSlot[] }) => setSlots(data.slots || []))
                .catch(() => setError("Failed to load available slots"))
        }
    }, [date, expert.id, open])

    const handleBook = async () => {
        if (!date || !selectedTime) return

        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expertId: expert.id,
                    date: format(date, "yyyy-MM-dd"),
                    time: selectedTime,
                    duration: 60,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Booking failed")
                return
            }

            onOpenChange(false)
            router.push("/dashboard")
            router.refresh()
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Book a Session with {expert.name}</DialogTitle>
                    <DialogDescription>
                        {expert.expertise} - ${expert.hourlyRate}/hour
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {error && (
                        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div>
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
                        <div>
                            <h3 className="text-sm font-medium mb-3">Select a Time</h3>
                            <TimeSlotPicker slots={slots} selectedTime={selectedTime} onSelectTime={setSelectedTime} />
                        </div>
                    )}

                    {date && selectedTime && (
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Booking Summary</p>
                            <p className="text-sm text-muted-foreground">
                                {format(date, "EEEE, MMMM d, yyyy")} at {selectedTime}
                            </p>
                            <p className="text-sm text-muted-foreground">Duration: 60 minutes</p>
                            <p className="text-sm font-medium mt-2">Total: ${expert.hourlyRate}</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleBook} disabled={!date || !selectedTime || loading}>
                        {loading ? "Booking..." : "Confirm Booking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
