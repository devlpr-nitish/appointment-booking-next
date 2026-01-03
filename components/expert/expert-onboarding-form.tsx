"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { applyExpertAction } from "@/app/actions/expert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const expertiseCategories = [
  "Business Strategy",
  "Software Engineering",
  "Marketing & Growth",
  "Product Design",
  "Career Coaching",
  "Finance & Investing",
  "Data Science",
  "Sales",
  "Legal",
  "Other",
]

export function ExpertOnboardingForm() {
  const router = useRouter()
  const [expertise, setExpertise] = useState("")
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!expertise || !bio || !hourlyRate) {
      setError("All fields are required")
      return
    }

    const rate = Number.parseFloat(hourlyRate)
    if (isNaN(rate) || rate <= 0) {
      setError("Please enter a valid hourly rate")
      return
    }

    setLoading(true)

    try {
      const result = await applyExpertAction({
        bio: bio,
        hourlyRate: rate,
        expertise: [expertise]
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Become an Expert</CardTitle>
        <CardDescription>Share your expertise and help others grow. Fill out the form below to apply.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="expertise">Area of Expertise</Label>
            <Select value={expertise} onValueChange={setExpertise} disabled={loading}>
              <SelectTrigger id="expertise">
                <SelectValue placeholder="Select your expertise" />
              </SelectTrigger>
              <SelectContent>
                {expertiseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
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

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              placeholder="100"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              required
              disabled={loading}
              min="1"
              step="1"
            />
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
