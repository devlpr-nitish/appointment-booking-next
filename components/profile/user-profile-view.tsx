"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User } from "@/lib/auth"

interface UserProfileViewProps {
    user: User
}

export function UserProfileView({ user }: UserProfileViewProps) {
    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground mt-1">
                    View your account information
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                        Your personal details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Name</Label>
                        <p className="font-medium">{user.name}</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Role</Label>
                        <p className="font-medium capitalize">{user.role}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
