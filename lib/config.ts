export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
        ? "https://api.appointment-booking.com"
        : "http://localhost:8080")
