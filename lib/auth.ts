
export interface User {
    id: string
    name: string
    email: string
    role: "admin" | "expert" | "user"
    isExpert?: boolean
    image?: string // Added as UserNav might use it properly (UserNav uses initials from name, but Avatar usually takes image)
}

import { redirect } from "next/navigation"

export async function getSession(): Promise<User | null> {
    // TODO: Implement actual session retrieval
    return null
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
