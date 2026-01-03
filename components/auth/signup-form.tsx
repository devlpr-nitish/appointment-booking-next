"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { registerAction } from "@/app/actions/auth"

export function SignupForm() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState<"user" | "expert">("user")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setLoading(true)

        try {
            const result = await registerAction(name, email, password, role)

            if (!result.success) {
                setError(result.message || "Signup failed")
                return
            }

            // Store token in cookie (if backend returns it, otherwise user needs to login)
            // For now, redirect to login page
            router.push("/login")
            router.refresh()
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">Get started by creating your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nitish Kushwaha"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-3">
                    <Label>I want to</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            disabled={loading}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${role === "user"
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-muted hover:border-muted-foreground/30 hover:bg-muted/50"
                                } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <div className={`text-2xl ${role === "user" ? "text-primary" : "text-muted-foreground"}`}>
                                👤
                            </div>
                            <div className="text-center">
                                <div className={`font-semibold ${role === "user" ? "text-primary" : "text-foreground"}`}>
                                    Book Sessions
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Find and book experts
                                </div>
                            </div>
                            {role === "user" && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole("expert")}
                            disabled={loading}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${role === "expert"
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-muted hover:border-muted-foreground/30 hover:bg-muted/50"
                                } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <div className={`text-2xl ${role === "expert" ? "text-primary" : "text-muted-foreground"}`}>
                                ⭐
                            </div>
                            <div className="text-center">
                                <div className={`font-semibold ${role === "expert" ? "text-primary" : "text-foreground"}`}>
                                    Become Expert
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Offer your expertise
                                </div>
                            </div>
                            {role === "expert" && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="devlprnitish@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    )
}
