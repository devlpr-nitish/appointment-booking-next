"use client"

import { Booking } from "@/app/actions/booking-actions"
import { ExpertBookingCard } from "./expert-booking-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExpertBookingsListProps {
    bookings: Booking[]
}

export function ExpertBookingsList({ bookings }: ExpertBookingsListProps) {
    const pendingBookings = bookings.filter(b => b.status === "pending")
    const confirmedBookings = bookings.filter(b => b.status === "confirmed")
    const completedBookings = bookings.filter(b => b.status === "completed")
    const cancelledBookings = bookings.filter(b => b.status === "cancelled")

    return (
        <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-4 pt-4">
                {pendingBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No pending bookings.</p>
                ) : (
                    pendingBookings.map((booking) => (
                        <ExpertBookingCard key={booking.ID} booking={booking} />
                    ))
                )}
            </TabsContent>
            <TabsContent value="confirmed" className="space-y-4 pt-4">
                {confirmedBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No confirmed bookings.</p>
                ) : (
                    confirmedBookings.map((booking) => (
                        <ExpertBookingCard key={booking.ID} booking={booking} />
                    ))
                )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4 pt-4">
                {completedBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No completed bookings.</p>
                ) : (
                    completedBookings.map((booking) => (
                        <ExpertBookingCard key={booking.ID} booking={booking} />
                    ))
                )}
            </TabsContent>
            <TabsContent value="cancelled" className="space-y-4 pt-4">
                {cancelledBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No cancelled bookings.</p>
                ) : (
                    cancelledBookings.map((booking) => (
                        <ExpertBookingCard key={booking.ID} booking={booking} />
                    ))
                )}
            </TabsContent>
        </Tabs>
    )
}
