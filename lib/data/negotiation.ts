"use server"
import { API_BASE_URL as API_URL } from "@/lib/config";
import { cookies } from "next/headers"

// --- Types ---

export type RequestStatus = "OPEN" | "ACCEPTED" | "CLOSED" | "CANCELED";
export type OfferStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface Category {
    id: string; // uuid
    name: string;
}

export interface ExpertInfo {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    rating?: number;
    expertise?: string;
    reviewCount?: number;
}

export interface Request {
    id: string; // uuid
    user_id: number;
    category_id: string; // uuid
    initial_amount: number;
    description: string;
    preferred_time?: string;
    duration?: number; // in minutes
    status: RequestStatus;
    created_at: string;
    updated_at: string;
    category?: Category;
    user?: any;
    offers?: Offer[];
    expires_at?: string;
}

export interface Offer {
    id: string; // uuid
    request_id: string; // uuid
    expert_id: number;
    amount: number;
    message?: string;
    status: OfferStatus;
    created_at: string;
    updated_at: string;
    expert?: ExpertInfo;
}

export interface ActivityEvent {
    id: string;
    type: "offer" | "counter" | "accepted" | "declined" | "request_created" | "request_canceled" | "request_expired";
    actor: string;
    amount?: number;
    message?: string;
    timestamp: string;
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
    const res = await fetch(`${API_URL}/api/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.data || [];
}

export async function createRequest(
    categoryId: string,
    amount: number,
    description: string,
    preferredTime?: string,
    duration?: number,
): Promise<Request> {
    const data = await fetchWithAuth("/api/requests", {
        method: "POST",
        body: JSON.stringify({
            category_id: categoryId,
            amount,
            description,
            preferred_time: preferredTime,
            duration,
        }),
    });
    return data.data;
}

export async function getRequest(id: string): Promise<Request> {
    const data = await fetchWithAuth(`/api/requests/${id}`);
    return data.data;
}

export async function getExpertRequests(): Promise<Request[]> {
    const data = await fetchWithAuth("/api/expert/requests");
    return data.data;
}

export async function createOffer(
    requestId: string,
    amount: number,
    message?: string,
): Promise<Offer> {
    const data = await fetchWithAuth("/api/offers", {
        method: "POST",
        body: JSON.stringify({ request_id: requestId, amount, message }),
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

export async function declineOffer(offerId: string): Promise<void> {
    await fetchWithAuth(`/api/offers/${offerId}/decline`, {
        method: "POST",
    });
}

export async function counterOffer(
    offerId: string,
    amount: number,
    message?: string,
): Promise<void> {
    await fetchWithAuth(`/api/offers/${offerId}/counter`, {
        method: "POST",
        body: JSON.stringify({ amount, message }),
    });
}

export async function cancelRequest(id: string) {
    return fetchWithAuth(`${API_URL}/requests/${id}/cancel`, {
        method: "POST",
    });
}
