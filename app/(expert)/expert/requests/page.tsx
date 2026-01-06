"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Request, getExpertRequests, getRequest } from "@/lib/data/negotiation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useActionToast } from "@/components/providers/action-toast-provider";
import { format } from "date-fns";
import { useWebSocket } from "@/components/providers/websocket-provider";

export default function ExpertRequestsPage() {
    const { toast } = useToast();
    const { showToast } = useActionToast();
    const { subscribe } = useWebSocket();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const data = await getExpertRequests();
            setRequests(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load requests",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();

        const unsubscribe = subscribe("NEW_REQUEST", async (payload: any) => {
            // Fetch the full request details
            try {
                const requestDetails = await getRequest(payload.request_id);

                // Show interactive toast
                showToast({
                    id: payload.request_id,
                    title: "New Request Available",
                    description: requestDetails.description || "A new request matches your expertise",
                    amount: requestDetails.initial_amount,
                    categoryName: requestDetails.category?.name,
                    type: "request",
                    autoCloseMs: 15000,
                });

                // Refresh the list
                fetchData();
            } catch (error) {
                console.error("Failed to fetch request details:", error);
                // Fallback to simple notification
                toast({
                    title: "New Request",
                    description: "A new request matches your expertise."
                });
                fetchData();
            }
        });

        return () => unsubscribe();
    }, [fetchData, subscribe, toast, showToast]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Open Requests</h1>
                <p className="text-muted-foreground">Requests matching your expertise.</p>
            </div>

            {requests.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">No open requests found.</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((req) => (
                        <Card key={req.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="line-clamp-1">{req.category?.name}</CardTitle>
                                    <Badge>{req.status}</Badge>
                                </div>
                                <CardDescription>
                                    {format(new Date(req.created_at), "PPP")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-2xl font-bold">${req.initial_amount.toFixed(2)}</div>
                                <p className="text-sm text-muted-foreground line-clamp-3">{req.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/expert/requests/${req.id}`}>View Details & Offer</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
