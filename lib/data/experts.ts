// Mock expert data (replace with real database in production)
import { Expert } from "@/lib/auth"

export const mockExperts: Expert[] = [
    {
        id: "1",
        userId: "u1",
        name: "Dr. Alice Smith",
        email: "alice@example.com",
        bio: "Experienced business consultant with 10+ years in strategy.",
        hourlyRate: 150,
        rating: 4.8,
        totalSessions: 120,
        verified: true,
        imageUrl: "/avatars/alice.jpg",
        reviews: []
    },
    {
        id: "2",
        userId: "u2",
        name: "Bob Jones",
        email: "bob@example.com",
        bio: "Senior Software Engineer specializing in React and Node.js.",
        hourlyRate: 100,
        rating: 4.9,
        totalSessions: 85,
        verified: false,
        imageUrl: "/avatars/bob.jpg",
        reviews: []
    }
]
