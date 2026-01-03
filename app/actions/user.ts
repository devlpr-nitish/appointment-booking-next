"use server"

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"
import { revalidatePath } from "next/cache"

export async function cancelAppointmentAction(bookingId: number) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const json = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: json.message || "Failed to cancel appointment"
            }
        }

        revalidatePath("/dashboard")
        return { success: true, data: json.data }
    } catch (error) {
        return { success: false, message: "An error occurred while canceling appointment" }
    }
}

export async function getUserBookingsAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/user`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })

        const json = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: json.message || "Failed to fetch bookings",
                data: []
            }
        }

        return { success: true, data: json.data }
    } catch (error) {
        return { success: false, message: "An error occurred while fetching bookings", data: [] }
    }
}
