"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlotPicker } from "./time-slot-picker"
import { format, addMonths, subMonths } from "date-fns"
import type { Expert } from "@/lib/auth"
import type { TimeRange } from "@/lib/data/bookings"
import { useRouter } from "next/navigation"
import { createBookingAction, getAvailableSlotsAction } from "@/app/actions/booking"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Globe, Video, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BookingInterfaceProps {
    expert: Expert
}

export function BookingInterface({ expert }: BookingInterfaceProps) {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [month, setMonth] = useState<Date>(new Date())
    const [startTime, setStartTime] = useState<string>("")
    const [endTime, setEndTime] = useState<string>("")
    const [availableRanges, setAvailableRanges] = useState<TimeRange[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [is24Hour, setIs24Hour] = useState(false)

    useEffect(() => {
        if (date) {
            setMonth(date)
        }
    }, [date])

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

            router.push("/user")
            router.refresh()
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center px-4 md:px-8 bg-black/5">
            <div className="w-full max-w-7xl bg-background text-foreground rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-border h-[600px]">

                <div className="p-8 border-b lg:border-b-0 lg:border-r border-border bg-background flex flex-col h-full">
                    {/* Fixed Calendar Header */}
                    <div className="flex items-center justify-between px-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMonth(subMonths(month, 1))}
                            className="h-10 w-10 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="text-lg font-semibold text-white">
                            {format(month, "MMMM yyyy")}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMonth(addMonths(month, 1))}
                            className="h-10 w-10 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            month={month}
                            onMonthChange={setMonth}
                            disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                            className="p-0 w-full max-w-md bg-transparent border-none shadow-none"
                            classNames={{
                                month: "space-y-6 w-full",
                                caption: "hidden",
                                caption_label: "hidden",
                                nav: "hidden",
                                head_row: "flex w-full mb-4 justify-between",
                                head_cell: "text-gray-500 w-12 h-10 font-medium text-xs uppercase tracking-wider flex items-center justify-center",
                                row: "flex w-full mt-2 justify-between",
                                cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                                day: "h-12 w-12 p-0 font-normal text-gray-300 hover:bg-white/10 rounded-xl transition-all aria-selected:opacity-100",
                                day_selected: "bg-white text-black hover:bg-white hover:text-black font-semibold rounded-xl shadow-md scale-105",
                                day_today: "text-white font-bold relative after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full",
                                day_outside: "text-gray-800 opacity-50",
                                day_disabled: "text-gray-800 opacity-30 cursor-not-allowed hover:bg-transparent",
                            }}
                        />
                    </div>
                </div>

                <div className="p-8 bg-background flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-lg font-medium text-gray-200">
                            {date ? format(date, "EEE d") : "Select Date"}
                        </div>
                        <div className="flex bg-white/5 rounded-lg p-1 relative isolate">
                            <button
                                onClick={() => setIs24Hour(false)}
                                className={cn(
                                    "relative z-10 px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200",
                                    !is24Hour ? "text-white" : "text-gray-400 hover:text-gray-200"
                                )}
                            >
                                12h
                                {!is24Hour && (
                                    <motion.div
                                        layoutId="active-time-mode"
                                        className="absolute inset-0 bg-[#2a2a2a] rounded-md shadow-sm -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setIs24Hour(true)}
                                className={cn(
                                    "relative z-10 px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200",
                                    is24Hour ? "text-white" : "text-gray-400 hover:text-gray-200"
                                )}
                            >
                                24h
                                {is24Hour && (
                                    <motion.div
                                        layoutId="active-time-mode"
                                        className="absolute inset-0 bg-[#2a2a2a] rounded-md shadow-sm -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
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
                                is24Hour={is24Hour}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                                <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                                <p>Select a date to view times</p>
                            </div>
                        )}
                    </div>

                    {date && startTime && endTime && (
                        <div className="pt-4 border-t border-white/10 mt-4">
                            <Button
                                size="lg"
                                className="w-full bg-white text-black cursor-pointer hover:bg-gray-200 transition-colors font-medium rounded-xl"
                                onClick={handleBook}
                                disabled={loading}
                            >
                                {loading ? "Booking..." : `Book ${startTime} - ${endTime}`}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}