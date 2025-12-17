"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User } from "@/lib/auth"
import { ExpertDashboardHeader } from "@/components/expert/expert-dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function ExpertProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [expertise, setExpertise] = useState("")
    const [bio, setBio] = useState("")
    const [hourlyRate, setHourlyRate] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        // Fetch current user data
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data: { user: User }) => {
                if (data.user) {
                    setUser(data.user)
                    // In production, fetch expert profile data and populate form
                }
            })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess(false)
        setLoading(true)

        try {
            const response = await fetch("/api/expert/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expertise, bio, hourlyRate: Number.parseFloat(hourlyRate) }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || "Failed to update profile")
                return
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/expert")
                router.refresh()
            }, 1500)
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background">
            <ExpertDashboardHeader user={user} />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                    <p className="text-muted-foreground mb-8">Update your expert profile information</p>

                    <Card>
                        <CardHeader>
                            <CardTitle>Expert Information</CardTitle>
                            <CardDescription>This information will be visible to clients</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="p-3 text-sm bg-primary/10 text-primary rounded-md border border-primary/20">
                                        Profile updated successfully!
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="expertise">Expertise</Label>
                                    <Input
                                        id="expertise"
                                        value={expertise}
                                        onChange={(e) => setExpertise(e.target.value)}
                                        placeholder="e.g., Business Strategy"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell clients about your experience..."
                                        rows={5}
                                        disabled={loading}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                                    <Input
                                        id="hourlyRate"
                                        type="number"
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(e.target.value)}
                                        placeholder="100"
                                        disabled={loading}
                                        min="1"
                                        step="1"
                                    />
                                </div>

                                <Button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
