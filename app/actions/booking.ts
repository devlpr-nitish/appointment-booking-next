"use server"

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"

export async function getAvailableSlotsAction(expertId: number, date: string) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const res = await fetch(`${API_BASE_URL}/expert/available-slots?expertId=${expertId}&date=${date}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    const json = await res.json()

    if (!res.ok) {
        return { success: false, message: json.message || "Failed to fetch slots" }
    }

    return { success: true, data: json.data }
}

export async function createBookingAction(expertId: number, date: string, startTime: string, endTime: string) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const res = await fetch(`${API_BASE_URL}/bookings/create-booking`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            expert_id: expertId,
            booking_date: date,
            start_time: startTime,
            end_time: endTime
        })
    })

    const json = await res.json()

    if (!res.ok) {
        const errorMsg = json.error?.reason || json.message || "Failed to create booking"
        return { success: false, message: errorMsg }
    }

    return { success: true, data: json.data }
}

