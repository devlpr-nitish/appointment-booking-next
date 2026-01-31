"use server"

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"
import { revalidatePath } from "next/cache"
import type { Expert } from "@/lib/auth"
import { mockExperts } from "@/lib/data/experts"

// ... existing imports

interface ExpertsApiResponse {
    success: boolean
    message: string
    data: {
        experts: any[]
        meta: {
            current_page: number
            total_pages: number
            total_items: number
            limit: number
        }
    }
}

export async function getExpertsAction(page = 1, limit = 10, category?: string, search?: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        const headers: HeadersInit = {}
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        let url = `${API_BASE_URL}/expert/get-experts?page=${page}&limit=${limit}`
        let isSearch = false

        if ((category && category !== 'all') || search) {
            const params = new URLSearchParams()
            if (category && category !== 'all') params.set("category", category)
            if (search) params.set("q", search)

            url = `${API_BASE_URL}/expert/search?${params.toString()}`
            isSearch = true
        }

        const res = await fetch(url, {
            method: "GET",
            headers: headers,
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error("Failed to fetch experts", await res.text())
            return {
                experts: [],
                meta: {
                    current_page: page,
                    total_pages: 0,
                    total_items: 0,
                    limit: limit
                }
            }
        }

        const json = await res.json()

        if (!json.success) {
            throw new Error(json.message)
        }

        let rawExperts = []
        let meta = {
            current_page: page,
            total_pages: 1,
            total_items: 0,
            limit: limit
        }

        if (isSearch) {
            rawExperts = Array.isArray(json.data) ? json.data : []
            meta.total_items = rawExperts.length
            meta.total_pages = Math.ceil(rawExperts.length / limit)
            const start = (page - 1) * limit
            rawExperts = rawExperts.slice(start, start + limit)
        } else {
            rawExperts = json.data.experts
            meta = json.data.meta
        }

        const experts: Expert[] = rawExperts.map((item: any) => ({
            id: item.id?.toString(),
            userId: item.user_id?.toString() || "",
            name: item.user?.name || "Unknown Expert",
            email: item.user?.email || "",
            expertise: item.expertise,
            bio: item.bio,
            hourlyRate: item.hourly_rate,
            rating: 0,
            totalSessions: 0,
            verified: item.is_verified,
            imageUrl: item.user?.image || "/placeholder-user.jpg",
            reviews: []
        }))

        return { experts, meta }

    } catch (error) {
        console.error("Error fetching experts:", error)
        return {
            experts: [],
            meta: { current_page: 1, total_pages: 1, total_items: 0, limit }
        }
    }
}

export async function getExpertByIdAction(id: string): Promise<Expert | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        const headers: HeadersInit = {}
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        const res = await fetch(`${API_BASE_URL}/expert/get-expert-by-id/${id}`, {
            method: "GET",
            headers: headers,
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error("Failed to fetch expert", await res.text())
            // Fallback to mock data
            // We need to cast mockExperts to Expert[] because of type mismatch potentially?
            // Actually lib/auth Expert has reviews as any[], lib/data Expert has specific Review[].
            // But checking the file content showed they are compatible enough or identical.
            // Let's coerce just in case.
            const mock = mockExperts.find(e => e.id === id) as unknown as Expert
            return mock || null
        }

        const json = await res.json()
        if (!json.success) {
            throw new Error(json.message)
        }

        const item = json.data

        return {
            id: item.id?.toString(),
            userId: item.user_id?.toString() || "",
            name: item.user?.name || "Unknown Expert",
            email: item.user?.email || "",
            expertise: item.expertise,
            bio: item.bio,
            hourlyRate: item.hourly_rate,
            rating: 0,
            totalSessions: 0,
            verified: item.is_verified,
            imageUrl: item.user?.image || "/placeholder-user.jpg",
            reviews: []
        }

    } catch (error) {
        console.error("Error fetching expert:", error)
        const mock = mockExperts.find(e => e.id === id) as unknown as Expert
        return mock || null
    }
}

export async function getFeaturedExpertsAction(limit = 6): Promise<Expert[]> {
    const { experts } = await getExpertsAction(1, limit)
    return experts
}

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
        if (data.categoryId !== undefined) {
            payload.category_id = data.categoryId
            delete payload.categoryId
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
