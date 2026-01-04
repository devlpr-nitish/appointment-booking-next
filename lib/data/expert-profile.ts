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
      cache: "no-store"
    })

    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch expert profile: ${res.statusText}`)
    }

    const json = await res.json()
    const backendExpert = json.data.expert

    const expert: Expert = {
      id: backendExpert.id.toString(),
      userId: backendExpert.user_id.toString(),
      name: backendExpert.user?.name || "Unknown",
      email: backendExpert.user?.email || "",
      expertise: backendExpert?.expertise,
      bio: backendExpert?.bio,
      hourlyRate: backendExpert?.hourly_rate,
      rating: 0,
      totalSessions: 0,
      verified: backendExpert?.is_verified,
      imageUrl: backendExpert.user?.profile_picture || "/placeholder.svg",
      reviews: [] // Reviews logic to be implemented
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
  // Check if we can use an API for this too, but request didn't strictly ask for it yet.
  // Sticking to scope of dynamic stats.
  // Actually, let's keep mock update for now unless needed.
  // The backend DOES have UpdateExpertProfile endpoint.
  // But let's focus on dashboard reading dynamic data first.

  const expert = mockExperts.find((expert) => expert.userId === userId)
  if (!expert) return null

  if (data.bio !== undefined) expert.bio = data.bio
  if (data.hourlyRate !== undefined) expert.hourlyRate = data.hourlyRate
  if (data.expertise !== undefined) expert.expertise = data.expertise

  return expert
}

export async function getExpertStats(expertId: string): Promise<ExpertStats> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return {
      totalEarnings: 0,
      upcomingSessions: 0,
      completedSessions: 0,
      averageRating: 0,
      pendingRequests: 0,
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}/expert/stats`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store",
      // Add revalidation tag if we want partial caching?
      // Using no-store for real-time stats.
    })

    if (!res.ok) {
      console.error("Failed to fetch expert stats", await res.text())
      return {
        totalEarnings: 0,
        upcomingSessions: 0,
        completedSessions: 0,
        averageRating: 0,
        pendingRequests: 0,
      }
    }

    const json = await res.json()
    const data = json.data

    return {
      totalEarnings: data.totalEarnings,
      upcomingSessions: data.upcomingSessions,
      completedSessions: data.completedSessions,
      averageRating: data.averageRating,
      pendingRequests: data.pendingRequests
    }

  } catch (error) {
    console.error("Error fetching expert stats:", error)
    return {
      totalEarnings: 0,
      upcomingSessions: 0,
      completedSessions: 0,
      averageRating: 0,
      pendingRequests: 0,
    }
  }
}
