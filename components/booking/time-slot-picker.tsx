"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TimeSlot } from "@/lib/data/bookings"
import { Loader2 } from "lucide-react"

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedTime: string | null
  onSelectTime: (time: string) => void
  isLoading?: boolean
}

export function TimeSlotPicker({ slots, selectedTime, onSelectTime, isLoading = false }: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading available slots...</span>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">No available slots</p>
          <p className="mt-1">This expert has no availability on the selected date.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {slots.map((slot) => (
        <Button
          key={slot.time}
          variant="outline"
          onClick={() => onSelectTime(slot.time)}
          disabled={!slot.available}
          className={cn(
            "h-auto py-3",
            selectedTime === slot.time && "border-primary bg-primary/10 text-primary hover:bg-primary/20",
            !slot.available && "opacity-50 cursor-not-allowed",
          )}
        >
          {slot.time}
        </Button>
      ))}
    </div>
  )
}
