// Mock expert data (replace with real database in production)
export interface Review {
    id: string
    author: string
    rating: number
    comment: string
    date: string
}

export interface Expert {
    id: string
    userId: string
    name: string
    email: string
    expertise: string
    bio: string
    hourlyRate: number
    rating: number
    totalSessions: number
    verified: boolean
    imageUrl: string
    reviews: Review[]
}

export const mockExperts: Expert[] = [
    {
        id: "1",
        userId: "u1",
        name: "Dr. Alice Smith",
        email: "alice@example.com",
        expertise: "business",
        bio: "Experienced business consultant with 10+ years in strategy.",
        hourlyRate: 150,
        rating: 4.8,
        totalSessions: 120,
        verified: true,
        imageUrl: "/avatars/alice.jpg",
        reviews: []
    },
    {
        id: "2",
        userId: "u2",
        name: "Bob Jones",
        email: "bob@example.com",
        expertise: "tech",
        bio: "Senior Software Engineer specializing in React and Node.js.",
        hourlyRate: 100,
        rating: 4.9,
        totalSessions: 85,
        verified: false,
        imageUrl: "/avatars/bob.jpg",
        reviews: []
    }
]


import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"

// ... (existing interfaces)

interface ExpertsApiResponse {
    success: boolean
    message: string
    data: {
        experts: any[] // We can refine this type later based on exact backend shape
        meta: {
            current_page: number
            total_pages: number
            total_items: number
            limit: number
        }
    }
}

export async function getExpertsPaginated(page = 1, limit = 10, category?: string): Promise<{ experts: Expert[], meta: ExpertsApiResponse['data']['meta'] }> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        const headers: HeadersInit = {}
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        let url = `${API_BASE_URL}/expert/get-experts?page=${page}&limit=${limit}`
        let isSearch = false

        if (category && category !== 'all') {
            url = `${API_BASE_URL}/expert/search?category=${category}`
            isSearch = true
        }

        const res = await fetch(url, {
            method: "GET",
            headers: headers,
            cache: 'no-store' // Ensure fresh data
        })

        console.log("res", res);

        if (!res.ok) {
            console.error("Failed to fetch experts", await res.text())
            // Fallback to mock data if API fails to avoid breaking UI during dev
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
            // Search endpoint returns data as an array of experts directly (inside json.data)
            rawExperts = Array.isArray(json.data) ? json.data : []
            meta.total_items = rawExperts.length
            meta.total_pages = Math.ceil(rawExperts.length / limit)
            // Manually paginate if the backend doesn't
            const start = (page - 1) * limit
            rawExperts = rawExperts.slice(start, start + limit)
        } else {
            // Standard paginated response
            rawExperts = json.data.experts
            meta = json.data.meta
        }

        const experts = rawExperts.map((item: any) => ({
            id: item.id?.toString(),
            userId: item.user_id?.toString() || "",
            name: item.user?.name || "Unknown Expert",
            email: item.user?.email || "",
            expertise: item.expertise,
            bio: item.bio,
            hourlyRate: item.hourly_rate,
            rating: 0, // Not yet in backend
            totalSessions: 0, // Not yet in backend
            verified: item.is_verified,
            imageUrl: item.user?.image || "/placeholder-user.jpg", // Adapt if backend sends image
            reviews: []
        }))

        return {
            experts,
            meta
        }

    } catch (error) {
        console.error("Error fetching experts:", error)
        // Fallback
        return {
            experts: [],
            meta: { current_page: 1, total_pages: 1, total_items: 0, limit }
        }
    }
}

export async function getExpertById(id: string): Promise<Expert | null> {
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
            // Fallback to mock data for now during dev if API fails or returns 404
            const mock = mockExperts.find(e => e.id === id)
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
        // Fallback
        const mock = mockExperts.find(e => e.id === id)
        return mock || null
    }
}

export async function getFeaturedExperts(limit = 6): Promise<Expert[]> {
    const { experts } = await getExpertsPaginated(1, limit)
    // In a real app we might filter by 'featured' flag or high ratings
    // For now, just return the first N experts
    return experts
}
