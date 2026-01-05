"use client";

import { Offer, OfferStatus } from "@/lib/data/negotiation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface OfferListProps {
    offers: Offer[];
    onAccept: (offerId: string) => void;
    isOwner?: boolean;
}

export function OfferList({ offers, onAccept, isOwner = false }: OfferListProps) {
    if (offers.length === 0) {
        return <div className="text-center text-muted-foreground p-4">No offers yet.</div>;
    }

    const getStatusVariant = (status: OfferStatus) => {
        switch (status) {
            case "ACCEPTED": return "default"; // or success color if available
            case "DECLINED": return "destructive";
            default: return "secondary";
        }
    };

    return (
        <div className="space-y-4">
            {offers.map((offer) => (
                <Card key={offer.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Offer from Expert</CardTitle>
                                <CardDescription>
                                    {format(new Date(offer.created_at), "PPP p")}
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusVariant(offer.status)}>{offer.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${offer.amount.toFixed(2)}</div>
                    </CardContent>
                    <CardFooter>
                        {isOwner && offer.status === "PENDING" && (
                            <Button onClick={() => onAccept(offer.id)}>Accept Offer</Button>
                        )}
                        {offer.status === "ACCEPTED" && (
                            <div className="text-green-600 font-medium">Accepted</div>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
