"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getExpertProfileAction, updateExpertProfileAction } from "@/app/actions/expert"
import { getCategoriesAction } from "@/app/actions/category"
import { Loader2, Save, Edit2, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Category {
    id: string
    name: string
}

interface ExpertProfile {
    id: number
    user_id: number
    bio: string
    expertise: string
    hourly_rate: number
    is_verified: boolean
    category_id?: string
    category?: Category
    user: {
        id: number
        name: string
        email: string
        role: string
    }
}

interface ExpertProfileViewProps {
    userId: string
}

export function ExpertProfileView({ userId }: ExpertProfileViewProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [profile, setProfile] = useState<ExpertProfile | null>(null)
    const [completionPercentage, setCompletionPercentage] = useState(0)
    const [categories, setCategories] = useState<Category[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)

    // Form state
    const [bio, setBio] = useState("")
    const [expertise, setExpertise] = useState("")
    const [hourlyRate, setHourlyRate] = useState("")
    const [categoryId, setCategoryId] = useState("")

    useEffect(() => {
        fetchProfile()
        fetchCategories()
    }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            setError("")

            const result = await getExpertProfileAction()

            if (!result.success) {
                if (result.message === "Unauthorized" || result.message === "No token found") {
                    router.push("/login")
                    return
                }
                setError(result.message || "Failed to load profile")
                return
            }

            setProfile(result.data.expert)
            setCompletionPercentage(result.data.completion_percentage || 0)

            // Set form values
            setBio(result.data.expert.bio || "")
            setExpertise(result.data.expert.expertise || "")
            setHourlyRate(result.data.expert.hourlyRate?.toString() || "")
            setCategoryId(result.data.expert.category_id || "")
        } catch (err) {
            setError("An error occurred while loading your profile")
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true)
            const result = await getCategoriesAction()

            if (result.success && result.data) {
                setCategories(result.data)
            }
        } catch (err) {
            console.error("Error loading categories:", err)
        } finally {
            setLoadingCategories(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            setError("")
            setSuccess("")

            const result = await updateExpertProfileAction({
                bio,
                expertise,
                hourlyRate: parseFloat(hourlyRate) || 0,
                categoryId: categoryId || undefined,
            })

            if (!result.success) {
                setError(result.message || "Failed to update profile")
                return
            }

            setSuccess("Profile updated successfully!")
            setIsEditing(false)

            // Refresh profile data
            await fetchProfile()
        } catch (err) {
            console.error("Error updating profile:", err)
            setError("An error occurred while saving your profile")
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        // Reset form to current profile values
        if (profile) {
            setBio(profile.bio || "")
            setExpertise(profile.expertise || "")
            setHourlyRate(profile.hourly_rate?.toString() || "")
            setCategoryId(profile.category_id || "")
        }
        setIsEditing(false)
        setError("")
        setSuccess("")
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error && !profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                            <div>
                                <h3 className="font-semibold text-lg">Error Loading Profile</h3>
                                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                            </div>
                            <Button onClick={fetchProfile}>Try Again</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Expert Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your expert profile and availability
                    </p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </div>

            {/* Profile Completion Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Completion</CardTitle>
                    <CardDescription>
                        Complete your profile to attract more clients
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Progress value={completionPercentage} className="flex-1" />
                        <span className="text-2xl font-bold text-primary">
                            {completionPercentage}%
                        </span>
                    </div>
                    {completionPercentage < 100 && (
                        <div className="text-sm text-muted-foreground">
                            {completionPercentage === 0 && "Get started by filling out your profile information"}
                            {completionPercentage > 0 && completionPercentage < 100 && "You're almost there! Complete all fields to reach 100%"}
                        </div>
                    )}
                    {completionPercentage === 100 && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                            <CheckCircle2 className="w-4 h-4" />
                            Your profile is complete!
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Alerts */}
            {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-500 rounded-lg border border-green-200 dark:border-green-900 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{success}</p>
                </div>
            )}

            {/* Profile Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Your professional details visible to potential clients
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* User Info (Read-only) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Name</Label>
                            <p className="font-medium">{profile?.user.name}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{profile?.user.email}</p>
                        </div>
                    </div>

                    {/* Editable Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bio">
                                Bio <span className="text-destructive">*</span>
                            </Label>
                            {isEditing ? (
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself and your expertise..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={5}
                                    className="resize-none"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md min-h-[120px]">
                                    {bio || "No bio provided yet"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            {isEditing ? (
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingCategories ? (
                                            <div className="p-2 text-center text-sm text-muted-foreground">
                                                Loading categories...
                                            </div>
                                        ) : categories.length > 0 ? (
                                            categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center text-sm text-muted-foreground">
                                                No categories available
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                                    {profile?.category?.name || "No category selected"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate">
                                Hourly Rate (USD) <span className="text-destructive">*</span>
                            </Label>
                            {isEditing ? (
                                <Input
                                    id="hourlyRate"
                                    type="number"
                                    placeholder="50"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                                    {hourlyRate ? `$${hourlyRate}/hour` : "No rate set"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <Button onClick={handleSave} disabled={saving} className="flex-1">
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                disabled={saving}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Verification Status</CardTitle>
                    <CardDescription>
                        Verified experts get more visibility
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {profile?.is_verified ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Verified Expert</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-5 h-5" />
                            <span>Pending verification - Complete your profile to get verified</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
