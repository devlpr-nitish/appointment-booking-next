"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TimeRange } from "@/lib/data/bookings"
import { Loader2, Clock } from "lucide-react"

interface TimeSlotPickerProps {
  availableRanges: TimeRange[]
  startTime: string
  endTime: string
  onTimeChange: (start: string, end: string) => void
  isLoading?: boolean
}

export function TimeSlotPicker({
  availableRanges,
  startTime,
  endTime,
  onTimeChange,
  isLoading = false
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading available availability...</span>
      </div>
    )
  }

  if (availableRanges.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">No available slots</p>
          <p className="mt-1">This expert has no availability on the selected date.</p>
        </div>
      </div>
    )
  }

  const handleRangeClick = (range: TimeRange) => {
    onTimeChange(range.start, range.end)
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Available Intervals
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableRanges.map((range, idx) => (
            <Button
              key={`${range.start}-${range.end}-${idx}`}
              variant="outline"
              size="sm"
              onClick={() => handleRangeClick(range)}
              className="text-xs"
            >
              {range.start} - {range.end}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Click a range to select the full duration, or enter a custom time below.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => onTimeChange(e.target.value, endTime)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => onTimeChange(startTime, e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
