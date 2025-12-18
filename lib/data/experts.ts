// Mock expert data (replace with real database in production)
export interface Review {
    id: string
    author: string
    rating: number
    comment: string
    date: string
}

export interface Expert {
    id: string
    userId: string
    name: string
    email: string
    expertise: string
    bio: string
    hourlyRate: number
    rating: number
    totalSessions: number
    verified: boolean
    imageUrl: string
    reviews: Review[]
}

export const mockExperts: Expert[] = [
    {
        id: "exp_1",
        userId: "user_1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        expertise: "Business Strategy",
        bio: "Former McKinsey consultant with 10+ years experience helping startups scale",
        hourlyRate: 150,
        rating: 4.9,
        totalSessions: 124,
        verified: true,
        imageUrl: "/professional-woman-diverse.png",
        reviews: [
            {
                id: "rev_1",
                author: "John Doe",
                rating: 5,
                comment: "Sarah provided excellent strategic advice that helped us pivot successfully.",
                date: "2023-11-15",
            },
            {
                id: "rev_2",
                author: "Jane Smith",
                rating: 4.8,
                comment: "Very knowledgeable and professional. Highly recommended.",
                date: "2023-10-20",
            },
        ],
    },
    {
        id: "exp_2",
        userId: "user_2",
        name: "Michael Chen",
        email: "michael@example.com",
        expertise: "Software Engineering",
        bio: "Tech lead at major tech companies, specializing in system architecture",
        hourlyRate: 120,
        rating: 4.8,
        totalSessions: 98,
        verified: true,
        imageUrl: "/professional-engineer.png",
        reviews: [
            {
                id: "rev_3",
                author: "Robert Brown",
                rating: 5,
                comment: "Michael helped me solve a complex architectural issue in just one session.",
                date: "2023-11-05",
            },
        ],
    },
    {
        id: "exp_3",
        userId: "user_3",
        name: "Emily Rodriguez",
        email: "emily@example.com",
        expertise: "Marketing & Growth",
        bio: "Growth marketing expert who scaled multiple companies to 7 figures",
        hourlyRate: 130,
        rating: 5.0,
        totalSessions: 156,
        verified: true,
        imageUrl: "/professional-woman-marketing.png",
        reviews: [],
    },
    {
        id: "exp_4",
        userId: "user_4",
        name: "David Kim",
        email: "david@example.com",
        expertise: "Product Design",
        bio: "Award-winning designer with experience at top design agencies",
        hourlyRate: 140,
        rating: 4.9,
        totalSessions: 87,
        verified: true,
        imageUrl: "/professional-man-designer.png",
        reviews: [],
    },
    {
        id: "exp_5",
        userId: "user_5",
        name: "Lisa Thompson",
        email: "lisa@example.com",
        expertise: "Career Coaching",
        bio: "Career coach helping professionals transition into tech roles",
        hourlyRate: 100,
        rating: 4.7,
        totalSessions: 203,
        verified: true,
        imageUrl: "/professional-woman-coach.png",
        reviews: [],
    },
    {
        id: "exp_6",
        userId: "user_6",
        name: "James Wilson",
        email: "james@example.com",
        expertise: "Finance & Investing",
        bio: "Financial advisor specializing in startup funding and investment strategies",
        hourlyRate: 160,
        rating: 4.8,
        totalSessions: 92,
        verified: true,
        imageUrl: "/professional-man-finance.png",
        reviews: [],
    },
]

export async function getExperts(): Promise<Expert[]> {
    // In production, fetch from database
    return mockExperts
}

export async function getExpertById(id: string): Promise<Expert | null> {
    // In production, fetch from database
    return mockExperts.find((expert) => expert.id === id) || null
}

export async function getFeaturedExperts(limit = 6): Promise<Expert[]> {
    // In production, fetch featured experts from database
    return mockExperts.slice(0, limit)
}
