// Mock users data for admin dashboard
export interface MockUser {
  id: string
  name: string
  email: string
  role: "user" | "expert" | "admin"
  joinedAt: string
  status: "active" | "suspended"
}

export const mockUsers: MockUser[] = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    joinedAt: "2024-01-15",
    status: "active",
  },
  {
    id: "user_2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    joinedAt: "2024-02-20",
    status: "active",
  },
  {
    id: "user_3",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "expert",
    joinedAt: "2023-11-10",
    status: "active",
  },
  {
    id: "user_4",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "expert",
    joinedAt: "2023-09-05",
    status: "active",
  },
  {
    id: "user_5",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "expert",
    joinedAt: "2024-03-12",
    status: "active",
  },
]
