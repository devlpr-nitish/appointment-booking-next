"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TimeSlot } from "@/lib/data/bookings"

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedTime: string | null
  onSelectTime: (time: string) => void
}

export function TimeSlotPicker({ slots, selectedTime, onSelectTime }: TimeSlotPickerProps) {
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
