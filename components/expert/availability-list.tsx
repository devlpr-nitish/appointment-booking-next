"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Clock } from "lucide-react"
import type { AvailabilitySlot } from "@/lib/data/availability"
import { getDayName, formatTime } from "@/lib/data/availability"

interface AvailabilityListProps {
    slots: AvailabilitySlot[]
    onEdit: (slot: AvailabilitySlot) => void
    onDelete: (id: number) => void
    isLoading?: boolean
}

export function AvailabilityList({ slots, onEdit, onDelete, isLoading }: AvailabilityListProps) {
    // Group slots by day of week
    const groupedSlots = slots.reduce(
        (acc, slot) => {
            if (!acc[slot.day_of_week]) {
                acc[slot.day_of_week] = []
            }
            acc[slot.day_of_week].push(slot)
            return acc
        },
        {} as Record<number, AvailabilitySlot[]>,
    )

    // Sort days (0-6)
    const sortedDays = Object.keys(groupedSlots)
        .map(Number)
        .sort((a, b) => a - b)

    if (slots.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Availability Set</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                        You haven't set any availability yet. Add your available hours to let clients know when they can book
                        sessions with you.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {sortedDays.map((dayOfWeek) => {
                const daySlots = groupedSlots[dayOfWeek]
                return (
                    <Card key={dayOfWeek} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{getDayName(dayOfWeek)}</CardTitle>
                                <Badge variant="secondary">{daySlots.length} slot{daySlots.length !== 1 ? "s" : ""}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {daySlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-muted-foreground">
                                                        {calculateDuration(slot.start_time, slot.end_time)}
                                                    </p>
                                                    {slot.is_recurring ? (
                                                        <Badge variant="outline" className="text-[10px] py-0 h-4">Recurring</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[10px] py-0 h-4">
                                                            {slot.date ? new Date(slot.date).toLocaleDateString() : "Specific Date"}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(slot)}
                                                disabled={isLoading}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(slot.id)}
                                                disabled={isLoading}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

function calculateDuration(startTime: string, endTime: string): string {
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)

    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = endHours * 60 + endMinutes
    const durationMinutes = endTotalMinutes - startTotalMinutes

    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    if (hours === 0) {
        return `${minutes} minutes`
    } else if (minutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`
    } else {
        return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} min`
    }
}
