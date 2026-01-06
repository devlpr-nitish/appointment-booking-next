"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Request, Offer, getRequest, getRequestOffers, acceptOffer } from "@/lib/data/negotiation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useActionToast } from "@/components/providers/action-toast-provider";
import { useWebSocket } from "@/components/providers/websocket-provider";
import { OfferList } from "@/components/negotiation/offer-list";
import { format } from "date-fns";

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { showToast } = useActionToast();
    const { subscribe } = useWebSocket();

    const [request, setRequest] = useState<Request | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const requestId = params?.id as string;

    const fetchData = useCallback(async () => {
        try {
            const [reqData, offersData] = await Promise.all([
                getRequest(requestId),
                getRequestOffers(requestId)
            ]);
            setRequest(reqData);
            setOffers(offersData);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load request details",
            });
        } finally {
            setLoading(false);
        }
    }, [requestId, toast]);

    const handleAcceptOffer = async (offerId: string) => {
        try {
            await acceptOffer(offerId);
            toast({
                title: "Success",
                description: "Offer accepted successfully",
            });
            fetchData();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to accept offer",
            });
        }
    };

    useEffect(() => {
        fetchData();

        // Subscribe to NEW_OFFER events for this request
        const unsubscribeOffer = subscribe("NEW_OFFER", async (payload: any) => {
            if (payload.request_id === requestId) {
                // Show interactive toast with accept option
                showToast({
                    id: payload.offer_id,
                    title: "New Counter-Offer Received",
                    description: "An expert has sent you a counter-offer",
                    amount: payload.amount,
                    type: "offer",
                    autoCloseMs: 20000, // 20 seconds for offers
                    onAccept: () => handleAcceptOffer(payload.offer_id),
                });

                // Refresh offers list
                fetchData();
            }
        });

        // Subscribe to OFFER_ACCEPTED events
        const unsubscribeAccepted = subscribe("OFFER_ACCEPTED", (payload: any) => {
            toast({
                title: "Offer Status Updated",
                description: "An offer has been accepted",
            });
            fetchData();
        });

        return () => {
            unsubscribeOffer();
            unsubscribeAccepted();
        };
    }, [fetchData, subscribe, requestId, toast, showToast]);

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
