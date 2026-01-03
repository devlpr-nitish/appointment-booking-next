"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import type { CreateAvailabilityData, UpdateAvailabilityData, AvailabilitySlot } from "@/lib/data/availability"
import { format } from "date-fns"

interface AvailabilityFormProps {
    onSubmit: (data: CreateAvailabilityData | UpdateAvailabilityData) => Promise<void>
    onCancel: () => void
    initialData?: AvailabilitySlot
    isLoading?: boolean
}

export function AvailabilityForm({ onSubmit, onCancel, initialData, isLoading }: AvailabilityFormProps) {
    const [date, setDate] = useState(initialData?.date || format(new Date(), "yyyy-MM-dd"))
    const [startTime, setStartTime] = useState(initialData?.start_time ?? "09:00")
    const [endTime, setEndTime] = useState(initialData?.end_time ?? "17:00")
    const [isRecurring, setIsRecurring] = useState(initialData?.is_recurring ?? true)
    const [error, setError] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate times
        if (startTime >= endTime) {
            setError("End time must be after start time")
            return
        }

        try {
            await onSubmit({
                date,
                start_time: startTime,
                end_time: endTime,
                is_recurring: isRecurring,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save availability")
        }
    }

    return (
        <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle>{initialData ? "Edit Availability" : "Add Availability"}</CardTitle>
                    <CardDescription>Set your available hours</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel} disabled={isLoading}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Select the date for this availability.
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="recurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Repeat weekly on this day
                        </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input
                                id="start-time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                        </div>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Saving..." : initialData ? "Update" : "Add"}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
