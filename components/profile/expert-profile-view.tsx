"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { getExpertProfileAction, updateExpertProfileAction } from "@/app/actions/expert"
import { updateProfileAction } from "@/app/actions/auth"
import { getCategoriesAction, searchCategoriesAction, findOrCreateCategoryAction } from "@/app/actions/category"
import {
    Loader2, Save, Edit2, CheckCircle2, AlertCircle, Plus, X,
    IndianRupee, Star, BadgeCheck, Clock, Tag, Camera,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Category {
    id: string
    name: string
}

interface ExpertProfile {
    id: number
    user_id: number
    bio: string
    hourly_rate: number
    is_verified: boolean
    category_id?: string
    category_ids?: string[]
    category?: Category
    categories?: Category[]
    user: {
        id: number
        name: string
        email: string
        role: string
        image_url?: string
    }
}

interface ExpertProfileViewProps {
    userId: string
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({
    title,
    onEdit,
    editing,
    children,
}: {
    title: string
    onEdit?: () => void
    editing?: boolean
    children: React.ReactNode
}) {
    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{title}</h2>
                {onEdit && !editing && (
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                        EDIT
                    </button>
                )}
            </div>
            <div className="px-6 py-5">{children}</div>
        </div>
    )
}

// ─── Read-only Field ───────────────────────────────────────────────────────────
function Field({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="space-y-0.5">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-foreground">{value || "—"}</p>
        </div>
    )
}

// ─── Save / Cancel ─────────────────────────────────────────────────────────────
function SaveCancelRow({
    saving,
    onSave,
    onCancel,
    compact = false,
}: {
    saving: boolean
    onSave: () => void
    onCancel: () => void
    compact?: boolean
}) {
    return (
        <div className={cn("flex gap-2", compact ? "pt-1" : "pt-3 border-t mt-2")}>
            <Button size={compact ? "sm" : "default"} onClick={onSave} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {compact ? "Save" : "Save Changes"}
            </Button>
            <Button size={compact ? "sm" : "default"} variant="outline" onClick={onCancel} disabled={saving}>
                Cancel
            </Button>
        </div>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function ExpertProfileView({ userId }: ExpertProfileViewProps) {
    const router = useRouter()
    const avatarInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [profile, setProfile] = useState<ExpertProfile | null>(null)
    const [completionPercentage, setCompletionPercentage] = useState(0)
    const [categories, setCategories] = useState<Category[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>()

    // Combobox state for category search
    const [categorySearchInput, setCategorySearchInput] = useState("")
    const [categorySearchResults, setCategorySearchResults] = useState<Category[]>([])
    const [searchingCategories, setSearchingCategories] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [creatingCategory, setCreatingCategory] = useState(false)
    const comboboxRef = useRef<HTMLDivElement>(null)

    // Which section is being edited
    const [editingSection, setEditingSection] = useState<"professional" | "categories" | null>(null)

    // Form state
    const [bio, setBio] = useState("")
    const [hourlyRate, setHourlyRate] = useState("")
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

    useEffect(() => { fetchProfile(); fetchCategories() }, [])

    // Auto-dismiss notifications after 5 seconds
    useEffect(() => {
        if (!success && !error) return
        const timer = setTimeout(() => { setSuccess(""); setError("") }, 5000)
        return () => clearTimeout(timer)
    }, [success, error])

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            setError("")
            const result = await getExpertProfileAction()
            if (!result.success) {
                if (result.message === "Unauthorized" || result.message === "No token found") {
                    router.push("/login"); return
                }
                setError(result.message || "Failed to load profile"); return
            }
            const e = result.data.expert
            setProfile(e)
            setCompletionPercentage(result.data.completion_percentage || 0)
            setBio(e.bio || "")
            setHourlyRate(e.hourlyRate?.toString() || e.hourly_rate?.toString() || "")
            setAvatarUrl(e.user?.image_url || undefined)
            const existing = e.category_ids || []
            const single = e.category_id
            setSelectedCategoryIds(existing.length > 0 ? existing : single ? [single] : [])
            // Seed the categories list from profile so chips display immediately on load
            if (e.categories && e.categories.length > 0) {
                setCategories((prev) => {
                    const merged = [...prev]
                    for (const cat of e.categories) {
                        if (!merged.find((c) => c.id === cat.id)) merged.push(cat)
                    }
                    return merged
                })
            }
        } catch {
            setError("An error occurred while loading your profile")
        } finally {
            setLoading(false)
        }
    }

    // Search categories with debounce
    const handleCategorySearch = async (query: string) => {
        setCategorySearchInput(query)
        setShowDropdown(true)
        if (!query.trim()) {
            // Show all when empty
            setCategorySearchResults(categories)
            return
        }
        setSearchingCategories(true)
        try {
            const result = await searchCategoriesAction(query)
            setCategorySearchResults(result.data || [])
        } finally {
            setSearchingCategories(false)
        }
    }

    // Select a suggestion from dropdown
    const handleSelectCategory = (cat: Category) => {
        if (!selectedCategoryIds.includes(cat.id)) {
            setSelectedCategoryIds((prev) => [...prev, cat.id])
            // Merge into local category list if not already there
            setCategories((prev) => prev.find((c) => c.id === cat.id) ? prev : [...prev, cat])
        }
        setCategorySearchInput("")
        setShowDropdown(false)
    }

    // Create a brand-new category and immediately select it
    const handleCreateCategory = async (name: string) => {
        setCreatingCategory(true)
        try {
            const result = await findOrCreateCategoryAction(name)
            if (result.success && result.data) {
                const newCat = result.data as Category
                setCategories((prev) => prev.find((c) => c.id === newCat.id) ? prev : [...prev, newCat])
                setSelectedCategoryIds((prev) => prev.includes(newCat.id) ? prev : [...prev, newCat.id])
                setCategorySearchInput("")
                setShowDropdown(false)
            } else {
                setError(result.message || "Failed to create category")
            }
        } finally {
            setCreatingCategory(false)
        }
    }

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true)
            const result = await getCategoriesAction()
            if (result.success && result.data) {
                setCategories(result.data)
                setCategorySearchResults(result.data) // initial dropdown list
            }
        } catch (err) {
            console.error("Error loading categories:", err)
        } finally {
            setLoadingCategories(false)
        }
    }

    const toggleCategory = (id: string) =>
        setSelectedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        )

    // ── Handle profile field save ──────────────────────────────────────────────
    const handleSave = async () => {
        try {
            setSaving(true); setError(""); setSuccess("")

            // Only send the fields the backend accepts — NOT a spread of Partial<Expert>
            const result = await updateExpertProfileAction({
                bio,
                hourlyRate: parseFloat(hourlyRate) || 0,
                categoryId: selectedCategoryIds[0] || undefined,
                categoryIds: selectedCategoryIds,
            })

            if (!result.success) {
                setError(result.message || "Failed to update profile")
                return
            }
            setSuccess("Profile saved!")
            setEditingSection(null)
            await fetchProfile()
        } catch {
            setError("An error occurred while saving your profile")
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (profile) {
            setBio(profile.bio || "")
            setHourlyRate(profile.hourly_rate?.toString() || "")
            const existing = profile.category_ids || []
            const single = profile.category_id
            setSelectedCategoryIds(existing.length > 0 ? existing : single ? [single] : [])
        }
        setEditingSection(null); setError(""); setSuccess("")
    }

    // ── Handle avatar upload ───────────────────────────────────────────────────
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Optimistic preview
        const previewUrl = URL.createObjectURL(file)
        setAvatarUrl(previewUrl)

        setUploadingAvatar(true)
        setError("")
        try {
            const formData = new FormData()
            formData.append("image", file)

            const res = await updateProfileAction(formData)
            if (!res.success) {
                setError(res.message || "Failed to upload image")
                setAvatarUrl(profile?.user?.image_url || undefined) // revert
                return
            }

            // Use the permanent URL from the backend if returned
            const newUrl = res.data?.user?.image_url
            if (newUrl) setAvatarUrl(newUrl)
            setSuccess("Profile picture updated!")
            router.refresh()
        } catch {
            setError("Image upload failed")
            setAvatarUrl(profile?.user?.image_url || undefined)
        } finally {
            setUploadingAvatar(false)
            // Reset input so same file can be re-selected
            if (avatarInputRef.current) avatarInputRef.current.value = ""
        }
    }

    const selectedCategories = categories.filter((c) => selectedCategoryIds.includes(c.id))
    const unselectedCategories = categories.filter((c) => !selectedCategoryIds.includes(c.id))

    const initials = profile?.user.name
        ?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "EX"

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error && !profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center p-8 rounded-2xl border bg-card max-w-sm w-full">
                    <AlertCircle className="w-10 h-10 text-destructive" />
                    <div>
                        <h3 className="font-semibold">Error Loading Profile</h3>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                    <Button onClick={fetchProfile}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

            {/* ── Hero Card ───────────────────────────────────────────────── */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />
                <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        {/* Avatar + name */}
                        <div className="flex items-center gap-4">
                            {/* Clickable avatar */}
                            <div className="relative group flex-shrink-0">
                                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                    {avatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={avatarUrl}
                                            alt={profile?.user.name || "Avatar"}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-white">{initials}</span>
                                    )}
                                </div>

                                {/* Camera overlay */}
                                <label
                                    htmlFor="expert-avatar-upload"
                                    className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    title="Change profile picture"
                                >
                                    {uploadingAvatar
                                        ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                                        : <Camera className="h-5 w-5 text-white" />
                                    }
                                </label>
                                <input
                                    id="expert-avatar-upload"
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={uploadingAvatar}
                                />
                            </div>

                            <div>
                                <h1 className="text-lg font-bold leading-tight">{profile?.user.name}</h1>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    {selectedCategories[0]?.name || "Expert"}
                                    {profile?.user.email && (
                                        <>
                                            <span className="text-muted-foreground/40">•</span>
                                            <span>{profile.user.email}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Verification badge */}
                        {profile?.is_verified ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Verified Expert
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-medium">
                                <Clock className="h-3.5 w-3.5" />
                                Pending Verification
                            </div>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t">
                        <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Hourly Rate</p>
                            <p className="text-sm font-semibold flex items-center gap-0.5 mt-0.5">
                                <IndianRupee className="h-3.5 w-3.5" />
                                {hourlyRate ? parseFloat(hourlyRate).toLocaleString("en-IN") : "—"}
                                <span className="font-normal text-muted-foreground">/hr</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Rating</p>
                            <p className="text-sm font-semibold flex items-center gap-1 mt-0.5">
                                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                4.8
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Categories</p>
                            <p className="text-sm font-semibold mt-0.5">{selectedCategoryIds.length || "—"}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Profile</p>
                            <p className="text-sm font-semibold mt-0.5">{completionPercentage}% complete</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Alerts ──────────────────────────────────────────────────── */}
            {error && (
                <div className="p-3.5 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
                </div>
            )}
            {success && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />{success}
                </div>
            )}

            {/* ── Two-column layout ────────────────────────────────────────── */}
            <div className="grid lg:grid-cols-[1fr_280px] gap-6">

                {/* ── LEFT ──────────────────────────────────────────────────── */}
                <div className="space-y-4">

                    {/* Basic details (read-only) */}
                    <SectionCard title="Basic details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                            <Field label="Name" value={profile?.user.name} />
                            <Field label="Email" value={profile?.user.email} />
                            <Field label="Role" value={profile?.user.role} />
                            <Field label="Status" value={profile?.is_verified ? "Verified" : "Pending Verification"} />
                        </div>
                    </SectionCard>

                    {/* Professional Info */}
                    <SectionCard
                        title="Professional info"
                        onEdit={() => setEditingSection("professional")}
                        editing={editingSection === "professional"}
                    >
                        {editingSection === "professional" ? (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="bio" className="text-xs uppercase tracking-wide text-muted-foreground">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={4}
                                        className="resize-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="hourlyRate" className="text-xs uppercase tracking-wide text-muted-foreground">Hourly Rate (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">₹</span>
                                        <Input
                                            id="hourlyRate"
                                            type="number"
                                            placeholder="500"
                                            value={hourlyRate}
                                            onChange={(e) => setHourlyRate(e.target.value)}
                                            min="0"
                                            className="pl-7"
                                        />
                                    </div>
                                </div>
                                <SaveCancelRow
                                    saving={saving}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                <Field label="Hourly Rate" value={hourlyRate ? `₹${parseFloat(hourlyRate).toLocaleString("en-IN")} / hr` : undefined} />
                                <div className="sm:col-span-2 space-y-0.5">
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Bio</p>
                                    <p className="text-sm text-foreground leading-relaxed">{bio || "—"}</p>
                                </div>
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
                <div className="space-y-4">

                    {/* Profile Completion */}
                    <div className="rounded-xl border bg-card shadow-sm p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Profile Completion</h3>
                            <span className="text-xs font-bold text-primary">{completionPercentage}%</span>
                        </div>
                        <Progress value={completionPercentage} className="h-1.5" />
                        <ul className="space-y-2 pt-1">
                            {[
                                { label: "Add bio", done: !!bio },
                                { label: "Set hourly rate", done: parseFloat(hourlyRate) > 0 },
                                { label: "Add categories", done: selectedCategoryIds.length > 0 },
                                { label: "Add profile picture", done: !!avatarUrl },
                            ].map((item) => (
                                <li key={item.label} className="flex items-center gap-2 text-xs">
                                    <CheckCircle2 className={cn("h-3.5 w-3.5 flex-shrink-0", item.done ? "text-emerald-500" : "text-muted-foreground/30")} />
                                    <span className={cn(item.done ? "line-through text-muted-foreground" : "text-foreground")}>
                                        {item.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories panel */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b">
                            <div className="flex items-center gap-1.5">
                                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">Categories</h3>
                            </div>
                            {editingSection !== "categories" && (
                                <button
                                    onClick={() => {
                                        setEditingSection("categories")
                                        setShowDropdown(false)
                                        setCategorySearchInput("")
                                        setCategorySearchResults(categories)
                                    }}
                                    className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <div className="p-4 space-y-3">
                            {/* Selected chips */}
                            {selectedCategories.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedCategories.map((cat) => (
                                        <span
                                            key={cat.id}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/30"
                                        >
                                            {cat.name}
                                            {editingSection === "categories" && (
                                                <button
                                                    onClick={() => setSelectedCategoryIds((prev) => prev.filter((id) => id !== cat.id))}
                                                    className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                                                >
                                                    <X className="h-2.5 w-2.5" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {selectedCategories.length === 0 && editingSection !== "categories" && (
                                <p className="text-xs text-muted-foreground">No categories yet. Click + to add.</p>
                            )}

                            {/* Combobox (shown in edit mode) */}
                            {editingSection === "categories" && (
                                <div className="space-y-2.5">
                                    {/* Typeahead input */}
                                    <div className="relative" ref={comboboxRef}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={categorySearchInput}
                                                onChange={(e) => handleCategorySearch(e.target.value)}
                                                onFocus={() => {
                                                    setShowDropdown(true)
                                                    if (!categorySearchInput) setCategorySearchResults(categories)
                                                }}
                                                placeholder="Search or create category..."
                                                className="w-full h-8 px-3 pr-8 text-xs rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                            />
                                            {searchingCategories || creatingCategory ? (
                                                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
                                            ) : (
                                                <Tag className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                        </div>

                                        {/* Dropdown */}
                                        {showDropdown && (
                                            <div className="absolute z-50 top-full mt-1 left-0 right-0 rounded-lg border bg-popover shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                                                {/* Matching results */}
                                                {categorySearchResults
                                                    .filter((c) => !selectedCategoryIds.includes(c.id))
                                                    .map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            onMouseDown={(e) => { e.preventDefault(); handleSelectCategory(cat) }}
                                                            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-primary/5 transition-colors"
                                                        >
                                                            <CheckCircle2 className="h-3 w-3 text-primary opacity-0" />
                                                            {cat.name}
                                                        </button>
                                                    ))}

                                                {/* Already-selected items shown with checkmark */}
                                                {categorySearchResults
                                                    .filter((c) => selectedCategoryIds.includes(c.id))
                                                    .map((cat) => (
                                                        <div
                                                            key={cat.id}
                                                            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-muted-foreground"
                                                        >
                                                            <CheckCircle2 className="h-3 w-3 text-primary" />
                                                            {cat.name}
                                                        </div>
                                                    ))}

                                                {/* Create new option */}
                                                {categorySearchInput.trim() &&
                                                    !categorySearchResults.some(
                                                        (c) => c.name.toLowerCase() === categorySearchInput.trim().toLowerCase()
                                                    ) && (
                                                        <button
                                                            type="button"
                                                            onMouseDown={(e) => { e.preventDefault(); handleCreateCategory(categorySearchInput.trim()) }}
                                                            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-primary hover:bg-primary/5 border-t transition-colors font-medium"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                            Add &ldquo;{categorySearchInput.trim()}&rdquo;
                                                        </button>
                                                    )}

                                                {categorySearchResults.filter((c) => !selectedCategoryIds.includes(c.id)).length === 0 &&
                                                    !categorySearchInput.trim() && (
                                                        <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                                                            Type to search or create a category
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>

                                    <SaveCancelRow
                                        saving={saving}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                        compact
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Verification */}
                    <div className="rounded-xl border bg-card shadow-sm p-5 space-y-2">
                        <h3 className="text-sm font-semibold">Verification</h3>
                        {profile?.is_verified ? (
                            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Your account is verified. You have higher visibility.</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span>Complete your profile to get verified.</span>
                                </div>
                                <Progress value={completionPercentage} className="h-1 mt-2" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
