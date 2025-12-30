"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import type { CreateAvailabilityData, UpdateAvailabilityData, AvailabilitySlot } from "@/lib/data/availability"

interface AvailabilityFormProps {
    onSubmit: (data: CreateAvailabilityData | UpdateAvailabilityData) => Promise<void>
    onCancel: () => void
    initialData?: AvailabilitySlot
    isLoading?: boolean
}

const DAYS_OF_WEEK = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
]

export function AvailabilityForm({ onSubmit, onCancel, initialData, isLoading }: AvailabilityFormProps) {
    const [dayOfWeek, setDayOfWeek] = useState<number>(initialData?.day_of_week ?? 1)
    const [startTime, setStartTime] = useState(initialData?.start_time ?? "09:00")
    const [endTime, setEndTime] = useState(initialData?.end_time ?? "17:00")
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
                day_of_week: dayOfWeek,
                start_time: startTime,
                end_time: endTime,
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
                    <CardDescription>Set your available hours for a specific day</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel} disabled={isLoading}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="day">Day of Week</Label>
                        <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(Number(value))}>
                            <SelectTrigger id="day">
                                <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                            <SelectContent>
                                {DAYS_OF_WEEK.map((day) => (
                                    <SelectItem key={day.value} value={day.value.toString()}>
                                        {day.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
