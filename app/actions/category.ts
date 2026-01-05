"use server"

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"

export async function getCategoriesAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })

        const json = await res.json()

        if (!res.ok) {
            return { success: false, message: json.message || "Failed to fetch categories" }
        }

        return { success: true, data: json.data || [] }
    } catch (error) {
        return { success: false, message: "An error occurred while fetching categories" }
    }
}
