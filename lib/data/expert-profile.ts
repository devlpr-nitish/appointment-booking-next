import { mockExperts, type Expert } from "./experts"
import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"

export interface ExpertStats {
  totalEarnings: number
  upcomingSessions: number
  completedSessions: number
  averageRating: number
  pendingRequests: number
}

export async function getExpertProfile(userId: string): Promise<Expert | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      console.error("No authentication token found")
      return null
    }

    const res = await fetch(`${API_BASE_URL}/expert/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store" // Ensure fresh data on each request
    })

    if (!res.ok) {
      if (res.status === 404) {
        // Expert profile not found
        return null
      }
      throw new Error(`Failed to fetch expert profile: ${res.statusText}`)
    }

    const json = await res.json()

    // The backend returns { expert: {...}, completion_percentage: number }
    // We need to map the backend Expert model to the frontend Expert type
    const backendExpert = json.data.expert

    const expert: Expert = {
      id: backendExpert.id.toString(),
      userId: backendExpert.user_id.toString(),
      name: backendExpert.user?.name || "Unknown",
      email: backendExpert.user?.email || "",
      expertise: backendExpert.expertise,
      bio: backendExpert.bio,
      hourlyRate: backendExpert.hourly_rate,
      rating: 0, // TODO: Calculate from reviews when implemented
      totalSessions: 0, // TODO: Get from bookings when implemented
      verified: backendExpert.is_verified,
      imageUrl: backendExpert.user?.profile_picture || "/placeholder.svg",
      reviews: []
    }

    return expert
  } catch (error) {
    console.error("Error fetching expert profile:", error)
    return null
  }
}

export async function updateExpertProfile(
  userId: string,
  data: Partial<Pick<Expert, "bio" | "hourlyRate" | "expertise">>,
): Promise<Expert | null> {
  const expert = mockExperts.find((expert) => expert.userId === userId)
  if (!expert) return null

  if (data.bio !== undefined) expert.bio = data.bio
  if (data.hourlyRate !== undefined) expert.hourlyRate = data.hourlyRate
  if (data.expertise !== undefined) expert.expertise = data.expertise

  return expert
}

// Availability management has been moved to /lib/data/availability.ts
// Use the functions from that file for managing expert availability

export async function getExpertStats(expertId: string): Promise<ExpertStats> {
  // In production, calculate from database
  const expert = mockExperts.find((e) => e.id === expertId)

  return {
    totalEarnings: expert ? expert.totalSessions * expert.hourlyRate : 0,
    upcomingSessions: 3,
    completedSessions: expert?.totalSessions || 0,
    averageRating: expert?.rating || 0,
    pendingRequests: 2,
  }
}
