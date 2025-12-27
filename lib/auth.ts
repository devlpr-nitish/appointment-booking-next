
export interface User {
    id: string
    name: string
    email: string
    role: "admin" | "expert" | "user"
    isExpert?: boolean
    image?: string // Added as UserNav might use it properly (UserNav uses initials from name, but Avatar usually takes image)
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

        // Return user based on token
        // Note: For now we default to "user" role and placeholder name/email 
        // as they are not in the token. In a real app, we might fetch profile here.
        return {
            id: payload.user_id?.toString() || "1",
            name: "User", // Placeholder
            email: "user@example.com", // Placeholder
            role: "user",
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
