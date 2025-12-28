"use server"

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"

export async function createBookingAction(expertId: number, slotId: number) {
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
            slot_id: slotId
        })
    })

    const json = await res.json()

    if (!res.ok) {
        return { success: false, message: json.message || "Failed to create booking" }
    }

    return { success: true, data: json.data }
}
