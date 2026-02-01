"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { TimeRange } from "@/lib/data/bookings"
import { cn } from "@/lib/utils"

interface TimeSlotPickerProps {
  availableRanges: TimeRange[]
  startTime: string
  endTime: string
  onTimeChange: (start: string, end: string) => void
  isLoading?: boolean
  is24Hour?: boolean
}

export function TimeSlotPicker({
  availableRanges,
  startTime,
  endTime,
  onTimeChange,
  isLoading = false,
  is24Hour = false
}: TimeSlotPickerProps) {

  // Helper to format time strings (HH:mm) to 12h/24h format
  const formatTime = (time: string, use24h: boolean) => {
    if (!time) return ""
    if (use24h) return time

    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'pm' : 'am'
    const h = hours % 12 || 12
    return `${h}:${minutes.toString().padStart(2, '0')}${period}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  if (availableRanges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-gray-400 font-medium">No slots available</p>
        <p className="text-gray-500 text-sm mt-1">Try selecting another date</p>
      </div>
    )
  }

  const slots: { start: string, end: string, label: string }[] = []

  availableRanges.forEach(range => {
    const start = range.start.split(':').map(Number)
    const end = range.end.split(':').map(Number)

    let currentHour = start[0]
    let currentMinute = start[1]

    const endHour = end[0]
    const endMinute = end[1]

    // Infinite loop protection
    let safety = 0
    while (safety < 100) {
      safety++

      // Calculate next slot time (30 mins later)
      let nextHour = currentHour
      let nextMinute = currentMinute + 30
      if (nextMinute >= 60) {
        nextHour++
        nextMinute -= 60
      }

      // Check if slot ends after the range end
      if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
        break
      }

      const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      const slotEnd = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`

      slots.push({
        start: slotStart,
        end: slotEnd,
        label: formatTime(slotStart, is24Hour)
      })

      currentHour = nextHour
      currentMinute = nextMinute
    }
  })

  return (
    <div className="grid grid-cols-1 gap-3">
      {slots.map((slot, idx) => {
        const isSelected = startTime === slot.start

        return (
          <Button
            key={`${slot.start}-${idx}`}
            variant="outline"
            className={cn(
              "w-full justify-center py-6 text-base font-medium border-white/10 transition-all duration-200",
              isSelected
                ? "bg-white text-white hover:bg-white hover:text-white border-transparent shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-1 ring-white"
                : "bg-transparent text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30"
            )}
            onClick={() => onTimeChange(slot.start, slot.end)}
          >
            {slot.label}
          </Button>
        )
      })}
    </div>
  )
}
