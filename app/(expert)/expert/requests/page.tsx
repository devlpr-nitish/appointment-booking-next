"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Request, getExpertRequests } from "@/lib/data/negotiation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useWebSocket } from "@/components/providers/websocket-provider";

export default function ExpertRequestsPage() {
    const { toast } = useToast();
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

        const unsubscribe = subscribe("NEW_REQUEST", (payload) => {
            // Optimally check if category matches, but for now just refresh
            toast({ title: "New Request", description: "A new request matches your expertise." });
            fetchData();
        });

        return () => unsubscribe();
    }, [fetchData, subscribe, toast]);

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
