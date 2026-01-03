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
  status: "pending" | "confirmed" | "cancelled" | "completed"
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
    status: "confirmed",
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
    status: "confirmed",
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


