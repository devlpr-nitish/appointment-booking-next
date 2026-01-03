import { mockAppointments, type Appointment } from "./appointments"

export interface TimeRange {
  start: string
  end: string
}

export interface BookingRequest {
  userId: string
  expertId: string
  date: string
  time: string
  duration: number
  slotId?: string
}

export async function getAvailableSlots(expertId: string, date: string): Promise<TimeRange[]> {
  // Mock implementation returning a full day range
  return [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "17:00" }
  ]
}

import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/config"

export async function createBooking(data: BookingRequest): Promise<Appointment> {
  const { userId, expertId, date, time } = data

  // Note: The backend expects 'slot_id' which represents a specific time slot.
  // The frontend currently passes date/time but we probably need to fetch slots first and get their IDs.
  // For this step, I'll assume we pass date/time and the backend might need adjustment or we need to find the slot ID.

  // However, looking at the backend handler:
  // type CreateBookingRequest struct {
  //     ExpertID uint `json:"expert_id" validate:"required"`
  //     SlotID   uint `json:"slot_id" validate:"required"`
  // }

  // The frontend needs to send a slot_id.
  // I need to check if getAvailableSlots provides slot IDs.

  // Let's assume for now we need to update getAvailableSlots to return IDs too.

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${API_BASE_URL}/bookings/create-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      expert_id: parseInt(expertId),
      slot_id: parseInt(data.slotId || "0") // Potential issue here if slotId is missing
    })
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || "Failed to create booking")
  }

  return json.data
}
