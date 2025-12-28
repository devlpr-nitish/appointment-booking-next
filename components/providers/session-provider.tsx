"use client"

import * as React from "react"
import { type User } from "@/lib/auth"

interface SessionContextType {
    user: User | null
}

const SessionContext = React.createContext<SessionContextType>({
    user: null,
})

export function useSession() {
    const context = React.useContext(SessionContext)
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider")
    }
    return context
}

interface SessionProviderProps {
    children: React.ReactNode
    user: User | null
}

export function SessionProvider({ children, user }: SessionProviderProps) {
    return (
        <SessionContext.Provider value={{ user }}>
            {children}
        </SessionContext.Provider>
    )
}
