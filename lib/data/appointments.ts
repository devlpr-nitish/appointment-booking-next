// Mock appointment data (replace with real database in production)
export interface Appointment {
  id: string
  userId: string
  expertId: string
  expertName: string
  expertExpertise: string
  expertImage: string
  date: string
  time: string
  duration: number
  status: "upcoming" | "completed" | "cancelled"
  price: number
  meetingLink?: string
}

export const mockAppointments: Appointment[] = [
  {
    id: "appt_1",
    userId: "user_1",
    expertId: "exp_1",
    expertName: "Sarah Johnson",
    expertExpertise: "Business Strategy",
    expertImage: "/professional-woman-diverse.png",
    date: "2025-01-15",
    time: "14:00",
    duration: 60,
    status: "upcoming",
    price: 150,
    meetingLink: "https://meet.example.com/abc123",
  },
  {
    id: "appt_2",
    userId: "user_1",
    expertId: "exp_2",
    expertName: "Michael Chen",
    expertExpertise: "Software Engineering",
    expertImage: "/professional-engineer.png",
    date: "2025-01-20",
    time: "10:00",
    duration: 60,
    status: "upcoming",
    price: 120,
    meetingLink: "https://meet.example.com/def456",
  },
  {
    id: "appt_3",
    userId: "user_1",
    expertId: "exp_3",
    expertName: "Emily Rodriguez",
    expertExpertise: "Marketing & Growth",
    expertImage: "/professional-woman-marketing.png",
    date: "2024-12-10",
    time: "15:00",
    duration: 60,
    status: "completed",
    price: 130,
  },
]

export async function getUserAppointments(userId: string): Promise<Appointment[]> {
  // In production, fetch from database
  return mockAppointments.filter((appt) => appt.userId === userId)
}

export async function getUpcomingAppointments(userId: string): Promise<Appointment[]> {
  const appointments = await getUserAppointments(userId)
  return appointments
    .filter((appt) => appt.status === "upcoming")
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
}

export async function getPastAppointments(userId: string): Promise<Appointment[]> {
  const appointments = await getUserAppointments(userId)
  return appointments
    .filter((appt) => appt.status === "completed")
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  // In production, update database
  const appointment = mockAppointments.find((appt) => appt.id === appointmentId)
  if (appointment) {
    appointment.status = "cancelled"
  }
}
