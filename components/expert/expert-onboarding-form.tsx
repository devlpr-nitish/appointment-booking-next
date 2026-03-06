"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { applyExpertAction } from "@/app/actions/expert"
import { getCategoriesAction } from "@/app/actions/category"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
}

export function ExpertOnboardingForm() {
  const router = useRouter()
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const result = await getCategoriesAction()
        if (result.success && result.data) setCategories(result.data)
      } catch { /* ignore */ } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!bio || !hourlyRate) {
      setError("Bio and hourly rate are required")
      return
    }
    if (selectedCategories.length === 0) {
      setError("Please select at least one category")
      return
    }

    const rate = Number.parseFloat(hourlyRate)
    if (isNaN(rate) || rate <= 0) {
      setError("Please enter a valid hourly rate")
      return
    }

    setLoading(true)
    try {
      // Pass selected category names as specializations (backend expects them)
      const categoryNames = categories
        .filter((c) => selectedCategories.includes(c.id))
        .map((c) => c.name)

      const result = await applyExpertAction({
        bio,
        hourlyRate: rate,
        expertise: categoryNames,
      })

      if (!result.success) {
        setError(result.message || "Application failed")
        return
      }

      router.push("/user")
      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectedCategoryObjects = categories.filter((c) => selectedCategories.includes(c.id))
  const unselectedCategoryObjects = categories.filter((c) => !selectedCategories.includes(c.id))

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Become an Expert</CardTitle>
        <CardDescription>Share your knowledge and help others grow. Fill out the form below to apply.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {/* Categories (multi-select chips) */}
          <div className="space-y-2">
            <Label>
              Categories <span className="text-destructive">*</span>
            </Label>

            {/* Selected chips */}
            {selectedCategoryObjects.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
                {selectedCategoryObjects.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground"
                  >
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className="rounded-full hover:bg-white/20 p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Available chips */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                {loadingCategories ? "Loading..." : "Click to select your categories:"}
              </p>
              {loadingCategories ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-7 w-24 rounded-full bg-muted animate-pulse" />)}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {unselectedCategoryObjects.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      disabled={loading}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all",
                        "border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      <Plus className="h-3 w-3" />
                      {cat.name}
                    </button>
                  ))}
                  {unselectedCategoryObjects.length === 0 && selectedCategoryObjects.length > 0 && (
                    <p className="text-xs text-muted-foreground italic">All categories selected</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">
              Professional Bio <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your experience and what makes you an expert..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              disabled={loading}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
          </div>

          {/* Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">
              Hourly Rate (₹) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">₹</span>
              <Input
                id="hourlyRate"
                type="number"
                placeholder="500"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
                disabled={loading}
                min="1"
                step="1"
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">Set your hourly consultation rate</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
