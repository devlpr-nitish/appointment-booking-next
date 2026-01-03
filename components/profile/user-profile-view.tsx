"use client"

import { useState } from "react"
import { User } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Shield } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface UserProfileViewProps {
    user: User
}

export function UserProfileView({ user }: UserProfileViewProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    // Form state (for Settings tab)
    const [name, setName] = useState(user.name)
    // Email is usually not editable easily without verification, keeping it read-only for now

    const handleLogout = async () => {
        await logoutAction()
        router.push("/")
        router.refresh()
    }

    const handleUpdateProfile = async () => {
        setIsLoading(true)
        // Simulate API call since we don't have a user update endpoint yet
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast({
            title: "Profile Updated",
            description: "Your profile information has been updated successfully.",
        })
        setIsLoading(false)
    }

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="container max-w-4xl py-8 space-y-8 mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                        <span className="mx-2">•</span>
                        <Badge variant="secondary" className="capitalize">
                            {user.role} Account
                        </Badge>
                    </div>
                </div>

                <Button variant="outline" className="hidden md:flex" onClick={handleLogout}>
                    Log out
                </Button>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Bookings
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Lifetime sessions
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Account Status
                                </CardTitle>
                                <Shield className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">Active</div>
                                <p className="text-xs text-muted-foreground">
                                    Member since 2024
                                </p>
                            </CardContent>
                        </Card>
                        {/* Placeholder for future stats */}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Your recent interactions and booking updates.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 text-sm text-muted-foreground text-center py-8">
                                <p>No recent activity to show.</p>
                                <Button variant="link" onClick={() => router.push('/user/appointments')}>
                                    View my appointments
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                                Update your personal information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Contact support to change your email address.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleUpdateProfile} disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 md:hidden">
                        <Button variant="destructive" className="w-full" onClick={handleLogout}>
                            Log out
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
