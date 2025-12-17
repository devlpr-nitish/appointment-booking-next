import { mockExperts, type Expert } from "./experts"
import { mockAppointments } from "./appointments"
import { mockUsers } from "./mock-users"

export interface PlatformStats {
  totalUsers: number
  totalExperts: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  pendingApplications: number
}

export interface UserManagementData {
  id: string
  name: string
  email: string
  role: "user" | "expert" | "admin"
  joinedAt: string
  totalBookings: number
  status: "active" | "suspended"
}

export async function getPlatformStats(): Promise<PlatformStats> {
  // In production, calculate from database
  const totalRevenue = mockAppointments.reduce((sum, appt) => sum + appt.price, 0)

  return {
    totalUsers: mockUsers.length,
    totalExperts: mockExperts.length,
    totalBookings: mockAppointments.length,
    totalRevenue,
    activeUsers: mockUsers.filter((u) => u.status === "active").length,
    pendingApplications: 3,
  }
}

export async function getAllUsers(): Promise<UserManagementData[]> {
  // In production, fetch from database
  return mockUsers.map((user) => {
    const userBookings = mockAppointments.filter((appt) => appt.userId === user.id)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      joinedAt: user.joinedAt,
      totalBookings: userBookings.length,
      status: user.status,
    }
  })
}

export async function getAllExperts(): Promise<Expert[]> {
  return mockExperts
}

export async function verifyExpert(expertId: string): Promise<void> {
  const expert = mockExperts.find((e) => e.id === expertId)
  if (expert) {
    expert.verified = true
  }
}

export async function suspendUser(userId: string): Promise<void> {
  const user = mockUsers.find((u) => u.id === userId)
  if (user) {
    user.status = "suspended"
  }
}

export async function activateUser(userId: string): Promise<void> {
  const user = mockUsers.find((u) => u.id === userId)
  if (user) {
    user.status = "active"
  }
}
