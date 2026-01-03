"use server"

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"
import { revalidatePath } from "next/cache"
import type { Expert } from "@/lib/auth"

export async function getExpertProfileAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const res = await fetch(`${API_BASE_URL}/expert/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    const json = await res.json()

    if (!res.ok) {
        return { success: false, message: json.message || "Failed to fetch profile" }
    }

    // Map backend snake_case to frontend camelCase
    const backendExpert = json.data.expert
    const expert = {
        ...backendExpert,
        hourlyRate: backendExpert.hourly_rate,
        totalSessions: backendExpert.total_sessions || 0,
        userId: backendExpert.user_id,
        // user: backendExpert.user // Assuming user object is compatible or needs mapping too
    }

    return { success: true, data: { ...json.data, expert } }
}

export async function updateExpertProfileAction(data: Partial<Expert>) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const payload: any = { ...data }
        // Map frontend camelCase to backend snake_case
        if (data.hourlyRate !== undefined) {
            payload.hourly_rate = data.hourlyRate
            delete payload.hourlyRate
        }
        // Add other fields if needed, e.g. totalSessions -> total_sessions (though usually read-only)

        const res = await fetch(`${API_BASE_URL}/expert/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const json = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: json.message || "Failed to update profile"
            }
        }

        revalidatePath("/expert/profile")

        // Map response back if needed, or just return success
        // Assuming the component re-fetches profile anyway or we can return mapped data
        const backendExpert = json.data
        const expert = {
            ...backendExpert,
            hourlyRate: backendExpert.hourly_rate,
            userId: backendExpert.user_id,
        }

        return { success: true, data: expert }
    } catch (error) {
        return { success: false, message: "An error occurred while updating profile" }
    }
}

export async function applyExpertAction(data: { bio: string, hourlyRate: number, expertise: string[] }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        // Checking if we should call backend directly or via Next.js API. 
        // Original code called /api/expert/apply. 
        // Assuming backend has /expert/apply route.
        const res = await fetch(`${API_BASE_URL}/expert/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                bio: data.bio,
                hourly_rate: data.hourlyRate,
                specializations: data.expertise
            })
        })

        const json = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: json.message || "Failed to apply as expert"
            }
        }

        return { success: true, data: json.data }
    } catch (error) {
        return { success: false, message: "An error occurred during application" }
    }
}

// Availability Actions

export async function getAvailabilityAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const res = await fetch(`${API_BASE_URL}/expert/availability`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
    })

    const json = await res.json()

    if (!res.ok) {
        return { success: false, message: json.message || "Failed to fetch availability" }
    }

    return { success: true, data: json.data || [] }
}

export async function createAvailabilityAction(data: any) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/expert/availability`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        const json = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: json.error?.details || json.error?.reason || json.message || "Failed to create availability"
            }
        }

        revalidatePath("/expert/availability")
        return { success: true, data: json.data }
    } catch (error) {
        return { success: false, message: "An error occurred while creating availability" }
    }
}

export async function updateAvailabilityAction(id: number, data: any) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/expert/availability/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        const json = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: json.error?.details || json.error?.reason || json.message || "Failed to update availability"
            }
        }

        revalidatePath("/expert/availability")
        return { success: true, data: json.data }
    } catch (error) {
        return { success: false, message: "An error occurred while updating availability" }
    }
}

export async function deleteAvailabilityAction(id: number) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const res = await fetch(`${API_BASE_URL}/expert/availability/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!res.ok) {
            const json = await res.json()
            return {
                success: false,
                message: json.error?.details || json.error?.reason || json.message || "Failed to delete availability"
            }
        }

        revalidatePath("/expert/availability")
        return { success: true }
    } catch (error) {
        return { success: false, message: "An error occurred while deleting availability" }
    }
}
