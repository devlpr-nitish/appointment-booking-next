import { API_BASE_URL } from "@/lib/config"

export interface AvailabilitySlot {
    id: number
    expert_id: number
    day_of_week: number // 0-6 (Sunday-Saturday)
    start_time: string // Format: "HH:MM"
    end_time: string // Format: "HH:MM"
    created_at: string
    updated_at: string
}

export interface CreateAvailabilityData {
    day_of_week: number
    start_time: string
    end_time: string
}

export interface UpdateAvailabilityData {
    day_of_week: number
    start_time: string
    end_time: string
}

/**
 * Fetch all availability slots for the authenticated expert
 */
export async function getExpertAvailability(token: string): Promise<AvailabilitySlot[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/expert/availability`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch availability: ${res.statusText}`)
        }

        const json = await res.json()
        return json.data || []
    } catch (error) {
        console.error("Error fetching availability:", error)
        throw error
    }
}

/**
 * Create a new availability slot
 */
export async function createAvailability(
    token: string,
    data: CreateAvailabilityData,
): Promise<AvailabilitySlot> {
    try {
        const res = await fetch(`${API_BASE_URL}/expert/availability`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorData = await res.json()
            // Extract detailed error message from backend response
            const errorMessage = errorData.error?.details || errorData.error?.reason || errorData.message || "Failed to create availability"
            throw new Error(errorMessage)
        }

        const json = await res.json()
        return json.data
    } catch (error) {
        console.error("Error creating availability:", error)
        throw error
    }
}

/**
 * Update an existing availability slot
 */
export async function updateAvailability(
    token: string,
    id: number,
    data: UpdateAvailabilityData,
): Promise<AvailabilitySlot> {
    try {
        const res = await fetch(`${API_BASE_URL}/expert/availability/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorData = await res.json()
            // Extract detailed error message from backend response
            const errorMessage = errorData.error?.details || errorData.error?.reason || errorData.message || "Failed to update availability"
            throw new Error(errorMessage)
        }

        const json = await res.json()
        return json.data
    } catch (error) {
        console.error("Error updating availability:", error)
        throw error
    }
}

/**
 * Delete an availability slot
 */
export async function deleteAvailability(token: string, id: number): Promise<void> {
    try {
        const res = await fetch(`${API_BASE_URL}/expert/availability/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            const errorData = await res.json()
            // Extract detailed error message from backend response
            const errorMessage = errorData.error?.details || errorData.error?.reason || errorData.message || "Failed to delete availability"
            throw new Error(errorMessage)
        }
    } catch (error) {
        console.error("Error deleting availability:", error)
        throw error
    }
}

/**
 * Get day name from day of week number
 */
export function getDayName(dayOfWeek: number): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek] || "Unknown"
}

/**
 * Format time string for display (e.g., "09:00" -> "9:00 AM")
 */
export function formatTime(time: string): string {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}
