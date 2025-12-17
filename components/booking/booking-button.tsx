"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookingModal } from "./booking-modal"
import { Calendar } from "lucide-react"
import type { Expert } from "@/lib/data/experts"
import { useRouter } from "next/navigation"

interface BookingButtonProps {
  expert: Expert
}

export function BookingButton({ expert }: BookingButtonProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = async () => {
    // Check if user is authenticated
    const response = await fetch("/api/auth/me")
    const data = await response.json()

    if (!data.user) {
      // Redirect to login
      router.push("/login")
      return
    }

    setIsModalOpen(true)
  }

  return (
    <>
      <Button size="lg" onClick={handleClick} className="w-full md:w-auto">
        <Calendar className="mr-2 h-5 w-5" />
        Book a Session
      </Button>
      <BookingModal expert={expert} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
