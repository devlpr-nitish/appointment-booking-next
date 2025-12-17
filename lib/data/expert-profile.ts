import { mockExperts, type Expert } from "./experts"

export interface ExpertAvailability {
  id: string
  expertId: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string
  endTime: string
}

export interface ExpertStats {
  totalEarnings: number
  upcomingSessions: number
  completedSessions: number
  averageRating: number
  pendingRequests: number
}

const mockAvailability: ExpertAvailability[] = []

export async function getExpertProfile(userId: string): Promise<Expert | null> {
  return mockExperts.find((expert) => expert.userId === userId) || null
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

export async function getExpertAvailability(expertId: string): Promise<ExpertAvailability[]> {
  return mockAvailability.filter((avail) => avail.expertId === expertId)
}

export async function addExpertAvailability(
  expertId: string,
  data: { dayOfWeek: number; startTime: string; endTime: string },
): Promise<ExpertAvailability> {
  const availability: ExpertAvailability = {
    id: `avail_${Date.now()}_${Math.random()}`,
    expertId,
    ...data,
  }

  mockAvailability.push(availability)
  return availability
}

export async function removeExpertAvailability(availabilityId: string): Promise<void> {
  const index = mockAvailability.findIndex((avail) => avail.id === availabilityId)
  if (index > -1) {
    mockAvailability.splice(index, 1)
  }
}

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
