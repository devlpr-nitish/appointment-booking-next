"use server"
import { API_BASE_URL as API_URL } from "@/lib/config";
import { cookies } from "next/headers"

// --- Types ---

export type RequestStatus = "OPEN" | "ACCEPTED" | "CLOSED";
export type OfferStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface Category {
    id: string; // uuid
    name: string;
}

export interface Request {
    id: string; // uuid
    user_id: number;
    category_id: string; // uuid
    initial_amount: number;
    description: string;
    status: RequestStatus;
    created_at: string;
    updated_at: string;
    category?: Category;
    user?: any; // Define User type if needed
    offers?: Offer[];
}

export interface Offer {
    id: string; // uuid
    request_id: string; // uuid
    expert_id: number;
    amount: number;
    status: OfferStatus;
    created_at: string;
    updated_at: string;
    expert?: any; // Define Expert type if needed
}

// --- API Functions ---

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "An error occurred");
    }

    return res.json();
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories`); // Public endpoint?
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.data || [];
}

export async function createRequest(categoryId: string, amount: number, description: string): Promise<Request> {
    const data = await fetchWithAuth("/api/requests", {
        method: "POST",
        body: JSON.stringify({ category_id: categoryId, amount, description }),
    });
    return data.data;
}

export async function getRequest(id: string): Promise<Request> {
    const data = await fetchWithAuth(`/api/requests/${id}`);
    return data.data;
}

export async function getExpertRequests(): Promise<Request[]> {
    // We need to pass category_id? But backend now fetches from profile.
    // But wait, my backend logic for GetExpertRequests *required* that I am an expert.
    const data = await fetchWithAuth("/api/expert/requests");
    return data.data;
}

export async function createOffer(requestId: string, amount: number): Promise<Offer> {
    const data = await fetchWithAuth("/api/offers", {
        method: "POST",
        body: JSON.stringify({ request_id: requestId, amount }),
    });
    return data.data;
}

export async function getRequestOffers(requestId: string): Promise<Offer[]> {
    const data = await fetchWithAuth(`/api/requests/${requestId}/offers`);
    return data.data;
}

export async function acceptOffer(offerId: string): Promise<void> {
    await fetchWithAuth(`/api/offers/${offerId}/accept`, {
        method: "POST",
    });
}
