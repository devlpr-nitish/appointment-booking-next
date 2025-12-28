import { NextResponse } from "next/server"

export async function GET(request: Request) {
    // Mock slots for now
    const slots = [
        { time: "09:00", available: true, id: 1 },
        { time: "10:00", available: true, id: 2 },
        { time: "11:00", available: false, id: 3 },
        { time: "14:00", available: true, id: 4 },
        { time: "15:00", available: true, id: 5 },
    ]
    return NextResponse.json({ slots })
}
