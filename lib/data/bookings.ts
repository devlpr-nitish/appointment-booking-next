import { mockAppointments, type Appointment } from "./appointments"

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingRequest {
  userId: string
  expertId: string
  date: string
  time: string
  duration: number
}

export async function getAvailableSlots(expertId: string, date: string): Promise<TimeSlot[]> {
  // In production, check expert availability and existing bookings
  const slots: TimeSlot[] = []
  const hours = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  for (const time of hours) {
    // Check if slot is already booked
    const isBooked = mockAppointments.some(
      (appt) => appt.expertId === expertId && appt.date === date && appt.time === time && appt.status !== "cancelled",
    )

    slots.push({
      time,
      available: !isBooked,
    })
  }

  return slots
}

export async function createBooking(data: BookingRequest): Promise<Appointment> {
  const { userId, expertId, date, time, duration } = data

  // In production, fetch expert details from database
  const { mockExperts } = await import("./experts")
  const expert = mockExperts.find((e) => e.id === expertId)

  if (!expert) {
    throw new Error("Expert not found")
  }

  const appointment: Appointment = {
    id: `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    expertId,
    expertName: expert.name,
    expertExpertise: expert.expertise,
    expertImage: expert.imageUrl,
    date,
    time,
    duration,
    status: "upcoming",
    price: expert.hourlyRate,
    meetingLink: `https://meet.example.com/${Math.random().toString(36).substr(2, 9)}`,
  }

  mockAppointments.push(appointment)
  return appointment
}
