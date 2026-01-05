"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Request, Offer, getRequest, getRequestOffers, acceptOffer } from "@/lib/data/negotiation";
import { OfferList } from "@/components/negotiation/offer-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useWebSocket } from "@/components/providers/websocket-provider";

export default function RequestDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const { toast } = useToast();
    const { subscribe } = useWebSocket();

    const [request, setRequest] = useState<Request | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [reqData, offersData] = await Promise.all([
                getRequest(id),
                getRequestOffers(id)
            ]);
            setRequest(reqData);
            setOffers(offersData);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch request details",
            });
        } finally {
            setLoading(false);
        }
    }, [id, toast]);

    useEffect(() => {
        if (id) {
            fetchData();

            // Subscribe to real-time updates
            const unsubscribeOffer = subscribe("NEW_OFFER", (payload) => {
                if (payload.request_id === id) {
                    toast({ title: "New Offer Received!", description: "An expert has sent a counter-offer." });
                    fetchData();
                }
            });

            const unsubscribeAccept = subscribe("OFFER_ACCEPTED", (payload) => {
                if (payload.request_id === id) {
                    fetchData();
                }
            });

            return () => {
                unsubscribeOffer();
                unsubscribeAccept();
            };
        }
    }, [id, fetchData, subscribe, toast]);

    const handleAcceptOffer = async (offerId: string) => {
        try {
            await acceptOffer(offerId);
            toast({
                title: "Success",
                description: "Offer accepted!",
            });
            // Refresh data
            fetchData();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to accept offer",
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!request) return <div>Request not found</div>;

    return (
        <div className="container mx-auto py-10 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Request Details</CardTitle>
                            <CardDescription>Posted on {format(new Date(request.created_at), "PPP")}</CardDescription>
                        </div>
                        <Badge variant={request.status === "OPEN" ? "default" : "secondary"}>
                            {request.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Category</h3>
                        <p>{request.category?.name || "Unknown"}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Initial Amount</h3>
                        <p className="text-xl font-bold">${request.initial_amount.toFixed(2)}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Description</h3>
                        <p className="whitespace-pre-wrap">{request.description}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Expert Offers</h2>
                <OfferList offers={offers} onAccept={handleAcceptOffer} isOwner={request.status === 'OPEN'} />
            </div>
        </div>
    );
}
