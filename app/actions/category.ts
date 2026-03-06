"use server"

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"

export async function getCategoriesAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/categories`, {
            headers: { "Authorization": `Bearer ${token}` },
            cache: "no-store"
        })
        const json = await res.json()
        if (!res.ok) return { success: false, message: json.message || "Failed to fetch categories" }
        return { success: true, data: json.data || [] }
    } catch {
        return { success: false, message: "An error occurred while fetching categories" }
    }
}

export async function searchCategoriesAction(query: string) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const url = query.trim()
            ? `${API_BASE_URL}/categories/search?q=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/categories`

        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` },
            cache: "no-store"
        })
        const json = await res.json()
        if (!res.ok) return { success: false, data: [] as { id: string; name: string }[] }
        return { success: true, data: (json.data || []) as { id: string; name: string }[] }
    } catch {
        return { success: false, data: [] as { id: string; name: string }[] }
    }
}

// Idempotent: finds existing by name or creates new one in DB
export async function findOrCreateCategoryAction(name: string) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: name.trim() })
        })
        const json = await res.json()
        if (!res.ok) return { success: false, message: json.message || "Failed to create category" }
        return { success: true, data: json.data as { id: string; name: string } }
    } catch {
        return { success: false, message: "An error occurred" }
    }
}
