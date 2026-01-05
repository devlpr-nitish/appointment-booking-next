"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Request, Offer, getRequest, getRequestOffers } from "@/lib/data/negotiation";
import { CreateOfferForm } from "@/components/negotiation/create-offer-form";
import { OfferList } from "@/components/negotiation/offer-list"; // To see own offers? or all?
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function ExpertRequestDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const { toast } = useToast();

    const [request, setRequest] = useState<Request | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]); // Maybe display all offers or just mine?
    // Ideally, experts might not see other experts' offers in blind auction, but requirements didn't specify.
    // "View the request" was specified. "View expert responses" was for User.
    // Assuming Experts CANNOT see other offers for fairness, or maybe they can?
    // Let's assume they can't by default to be safe, OR if the list endpoint isn't restricted.
    // `getRequestOffers` fetches all offers. If I use it here, Expert sees all.
    // Let's hide the list for now or show it if transparency is desired. 
    // Requirement: "User can: View expert responses". Didn't say Experts can view others.
    // But usually in bidding they might want to see.
    // I will Show "Your Offers" only or just show the Form.
    // Let's show existing offers for context if the API allows it (it does).

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const reqData = await getRequest(id);
            setRequest(reqData);
            // const offersData = await getRequestOffers(id); // Optional
            // setOffers(offersData);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch request details",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id, toast]);

    if (loading) return <div>Loading...</div>;
    if (!request) return <div>Request not found</div>;

    return (
        <div className="container mx-auto py-10 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
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
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Counter Offer</CardTitle>
                        <CardDescription>
                            Propose a new amount for this request.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {request.status === "OPEN" ? (
                            <CreateOfferForm requestId={id} onSuccess={() => {
                                // Maybe fetch offers to show "You already offered X"
                            }} />
                        ) : (
                            <div className="text-center p-4 bg-muted rounded-md">
                                This request is {request.status.toLowerCase()} and cannot accept new offers.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
