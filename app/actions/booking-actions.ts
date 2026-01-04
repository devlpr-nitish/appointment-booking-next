"use server"

import { API_BASE_URL } from "@/lib/config"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export interface BookingUser {
    id: number
    name: string
    email: string
    image?: string
}

export interface Booking {
    ID: number
    UserID: number
    ExpertID: number
    booking_date: string
    start_time: string
    end_time: string
    total_price: number
    cancellation_reason?: string
    status: "pending" | "confirmed" | "cancelled" | "completed"
    user?: BookingUser
    created_at: string
}

export async function getExpertBookings(status: string = "all"): Promise<Booking[]> {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const res = await fetch(`${API_BASE_URL}/bookings/expert?status=${status}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed to fetch bookings")
    }

    const json = await res.json()
    return json.data || []
}

export async function updateBookingStatusAction(bookingId: number, status: string, cancellationReason?: string): Promise<void> {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        // If status is cancelled, use the cancel endpoint
        if (status === "cancelled") {
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ reason: cancellationReason || "No reason provided" })
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.message || "Failed to cancel booking")
            }
        } else {
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.message || "Failed to update booking status")
            }
        }

        revalidatePath("/expert")
    } catch (error) {
        throw error
    }
}
