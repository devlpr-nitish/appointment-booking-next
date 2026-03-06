"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Request,
    Offer,
    ActivityEvent,
    getRequest,
    getRequestOffers,
    createOffer,
} from "@/lib/data/negotiation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CounterOfferModal } from "@/components/negotiation/counter-offer-modal";
import { ActivityTimeline } from "@/components/negotiation/activity-timeline";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/components/providers/websocket-provider";
import { format, formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    Tag,
    Calendar,
    Clock,
    IndianRupee,
    CheckCircle2,
    RefreshCw,
    Send,
    MessageSquare,
    FileText,
    Wifi,
    WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExpertRequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { toast } = useToast();
    const { subscribe, isConnected } = useWebSocket();

    const [request, setRequest] = useState<Request | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [offerSent, setOfferSent] = useState(false);
    const [myOffer, setMyOffer] = useState<Offer | null>(null);
    const [counterModalOpen, setCounterModalOpen] = useState(false);
    const [events, setEvents] = useState<ActivityEvent[]>([]);

    const buildEvents = useCallback((req: Request, offerList: Offer[]): ActivityEvent[] => {
        const evts: ActivityEvent[] = [
            {
                id: `req-${req.id}`,
                type: "request_created",
                actor: "User",
                amount: req.initial_amount,
                timestamp: req.created_at,
            },
        ];
        offerList.forEach((o) => {
            evts.push({
                id: `offer-${o.id}`,
                type: "offer",
                actor: "You",
                amount: o.amount,
                message: o.message,
                timestamp: o.created_at,
            });
            if (o.status === "ACCEPTED") {
                evts.push({
                    id: `accepted-${o.id}`,
                    type: "accepted",
                    actor: "User",
                    amount: o.amount,
                    timestamp: o.updated_at,
                });
            }
        });
        return evts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const reqData = await getRequest(id);
            const offersData = await getRequestOffers(id);
            setRequest(reqData);
            setOffers(offersData);
            setEvents(buildEvents(reqData, offersData));
            // Check if we (the expert) already sent an offer
            if (offersData.length > 0) {
                setMyOffer(offersData[0]); // In a real app, filter by current expert ID
                setOfferSent(true);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch request details" });
        } finally {
            setLoading(false);
        }
    }, [id, toast, buildEvents]);

    const handleSubmitOffer = async (amount: number, message?: string) => {
        await createOffer(id, amount, message);
        setOfferSent(true);
        toast({ title: "Offer Sent!", description: "Your offer has been sent to the user." });
        fetchData();
    };

    useEffect(() => {
        if (id) fetchData();
        const unsub = subscribe("OFFER_ACCEPTED", () => fetchData());
        const unsub2 = subscribe("COUNTER_OFFER", () => fetchData());
        return () => { unsub(); unsub2(); };
    }, [id, fetchData, subscribe]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-muted-foreground">Request not found.</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const isOpen = request.status === "OPEN";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/10">
            {/* Header */}
            <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-sm font-semibold">Request Details</h1>
                            <p className="text-xs text-muted-foreground">{request.category?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full",
                            isConnected
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                        )}>
                            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                            {isConnected ? "Live" : "Offline"}
                        </div>
                        <Badge variant={isOpen ? "default" : "secondary"}
                            className={cn(isOpen && "bg-indigo-600 hover:bg-indigo-600")}>
                            {request.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                    {/* Left: Request details + Offer action */}
                    <div className="space-y-4">
                        {/* Request Details Card */}
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-5 sm:p-6 space-y-4">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-1.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-medium border border-indigo-200/50 w-fit">
                                            <Tag className="h-3 w-3" />
                                            {request.category?.name}
                                        </div>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            {request.description}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 border border-indigo-100 dark:border-indigo-900 rounded-xl px-4 py-3 text-center">
                                            <p className="text-xs text-muted-foreground mb-1">User's Budget</p>
                                            <div className="flex items-center gap-0.5 text-2xl font-bold text-indigo-700 dark:text-indigo-300 justify-center">
                                                <IndianRupee className="h-5 w-5" />
                                                {request.initial_amount.toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                                    {request.preferred_time && (
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {format(new Date(request.preferred_time), "MMM d, yyyy h:mm a")}
                                        </div>
                                    )}
                                    {request.duration && (
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {request.duration} minutes
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5" />
                                        Posted {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Send Offer / Offer Status Card */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="px-5 pt-5 pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    {offerSent ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            Your Offer
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 text-indigo-500" />
                                            {isOpen ? "Make an Offer" : "Request Closed"}
                                        </>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5">
                                {offerSent && myOffer ? (
                                    <div className="space-y-3">
                                        <div className={cn(
                                            "rounded-xl p-4 border",
                                            myOffer.status === "ACCEPTED"
                                                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300/60"
                                                : "bg-muted/40"
                                        )}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1 text-xl font-bold">
                                                    <IndianRupee className="h-4 w-4" />
                                                    {myOffer.amount.toLocaleString("en-IN")}
                                                </div>
                                                <Badge
                                                    variant={myOffer.status === "ACCEPTED" ? "default" : "secondary"}
                                                    className={cn(
                                                        myOffer.status === "ACCEPTED" && "bg-emerald-600 hover:bg-emerald-600"
                                                    )}
                                                >
                                                    {myOffer.status}
                                                </Badge>
                                            </div>
                                            {myOffer.message && (
                                                <p className="text-xs text-muted-foreground italic">"{myOffer.message}"</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Sent {formatDistanceToNow(new Date(myOffer.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        {isOpen && myOffer.status === "PENDING" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full gap-1.5"
                                                onClick={() => setCounterModalOpen(true)}
                                            >
                                                <RefreshCw className="h-3.5 w-3.5" />
                                                Revise Offer
                                            </Button>
                                        )}
                                    </div>
                                ) : isOpen ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            Set your price to make an offer on this request.
                                        </p>
                                        <Button
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                                            onClick={() => setCounterModalOpen(true)}
                                        >
                                            <Send className="h-4 w-4" />
                                            Send Offer
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center p-4 bg-muted rounded-xl text-sm text-muted-foreground">
                                        This request is {request.status.toLowerCase()} and no longer accepting offers.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Activity Timeline */}
                    <div>
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-3 px-5 pt-5">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                                    Negotiation History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5">
                                <ActivityTimeline events={events} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Counter / Offer Modal */}
            <CounterOfferModal
                isOpen={counterModalOpen}
                onClose={() => setCounterModalOpen(false)}
                onSubmit={handleSubmitOffer}
                currentAmount={request.initial_amount}
                isExpertSide
            />
        </div>
    );
}
