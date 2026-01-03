
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
    reviews: any[]
}

export interface User {
    id: string
    name: string
    email: string
    role: "admin" | "expert" | "user"
    isExpert?: boolean
    image?: string
}

import { redirect } from "next/navigation"

import { cookies } from "next/headers"

export async function getSession(): Promise<User | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        return null
    }

    try {
        // Decode JWT payload (middle part)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            return null
        }

        // Return user data from token
        return {
            id: payload.user_id?.toString() || "",
            name: payload.name || "User",
            email: payload.email || "",
            role: payload.role || "user",
            isExpert: payload.role === "expert",
        }
    } catch (error) {
        return null
    }
}

export async function requireAuth(): Promise<User> {
    const session = await getSession()
    if (!session) {
        redirect("/login")
    }
    return session
}

export async function requireRole(role: "admin" | "expert" | "user"): Promise<User> {
    const session = await getSession()
    if (!session || session.role !== role) {
        redirect("/login")
    }
    return session
}
