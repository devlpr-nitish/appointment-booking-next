"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";

// Event Types
export type EventType = "NEW_REQUEST" | "NEW_OFFER" | "OFFER_ACCEPTED";

export interface WSEvent {
    type: EventType;
    payload: any;
}

interface WebSocketContextType {
    isConnected: boolean;
    socket: WebSocket | null;
    subscribe: (eventType: EventType, callback: (payload: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const subscribersRef = useRef<Map<EventType, Set<(payload: any) => void>>>(new Map());

    useEffect(() => {
        // Only connect if we are in the browser
        if (typeof window === "undefined") return;

        // Get token for auth (if backend requires it via query param)
        // For now backend is open, but usually: ?token=...
        const wsUrl = (API_BASE_URL || "").replace("http", "ws") + "/api/ws";

        const connect = () => {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connected");
                setIsConnected(true);
                setSocket(ws);
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected");
                setIsConnected(false);
                setSocket(null);
                // Reconnect after 3s
                setTimeout(connect, 3000);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            ws.onmessage = (event) => {
                try {
                    const wsEvent: WSEvent = JSON.parse(event.data);
                    const subscribers = subscribersRef.current.get(wsEvent.type);
                    if (subscribers) {
                        subscribers.forEach((callback) => callback(wsEvent.payload));
                    }
                } catch (error) {
                    console.error("Failed to parse WS message:", error);
                }
            };
        };

        connect();

        return () => {
            // No cleanup on unmount for now to keep it alive or manage carefully
            // But ideally:
            // if (socket) socket.close();
        };
    }, []);

    const subscribe = (eventType: EventType, callback: (payload: any) => void) => {
        if (!subscribersRef.current.has(eventType)) {
            subscribersRef.current.set(eventType, new Set());
        }
        subscribersRef.current.get(eventType)?.add(callback);

        return () => {
            subscribersRef.current.get(eventType)?.delete(callback);
        };
    };

    return (
        <WebSocketContext.Provider value={{ isConnected, socket, subscribe }}>
            {children}
        </WebSocketContext.Provider>
    );
}
