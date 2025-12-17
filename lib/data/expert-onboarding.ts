// Expert onboarding functionality
export interface ExpertApplication {
  id: string
  userId: string
  expertise: string
  bio: string
  hourlyRate: number
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

const mockApplications: ExpertApplication[] = []

export async function submitExpertApplication(
  userId: string,
  data: {
    expertise: string
    bio: string
    hourlyRate: number
  },
): Promise<ExpertApplication> {
  const application: ExpertApplication = {
    id: `app_${Date.now()}`,
    userId,
    expertise: data.expertise,
    bio: data.bio,
    hourlyRate: data.hourlyRate,
    status: "pending",
    submittedAt: new Date().toISOString(),
  }

  mockApplications.push(application)
  return application
}

export async function getExpertApplication(userId: string): Promise<ExpertApplication | null> {
  return mockApplications.find((app) => app.userId === userId) || null
}

export async function approveExpertApplication(applicationId: string): Promise<void> {
  const application = mockApplications.find((app) => app.id === applicationId)
  if (application) {
    application.status = "approved"
  }
}
