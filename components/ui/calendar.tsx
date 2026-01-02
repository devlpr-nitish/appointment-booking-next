
"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    date?: Date | undefined
}

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    date,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            selected={date}
            {...(props as any)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 pb-2 relative items-center mb-1",
                caption_label: "text-sm font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-background p-0 hover:bg-accent hover:text-accent-foreground border-input transition-colors rounded-md"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex w-full mb-1",
                head_cell:
                    "text-muted-foreground w-9 h-9 font-medium text-xs flex items-center justify-center",
                row: "flex w-full mt-1",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-all rounded-full"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-green-500 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white font-semibold rounded-full",
                day_today: "bg-accent text-accent-foreground font-semibold border border-primary/20 aria-selected:bg-green-500 aria-selected:text-white aria-selected:border-transparent",
                day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
