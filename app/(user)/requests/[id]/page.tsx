"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Request,
    Offer,
    ActivityEvent,
    getRequest,
    getRequestOffers,
    acceptOffer,
    declineOffer,
    counterOffer,
    cancelRequest,
} from "@/lib/data/negotiation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useActionToast } from "@/components/providers/action-toast-provider";
import { useWebSocket } from "@/components/providers/websocket-provider";
import { OfferCard } from "@/components/negotiation/offer-card";
import { CounterOfferModal } from "@/components/negotiation/counter-offer-modal";
import { ActivityTimeline } from "@/components/negotiation/activity-timeline";
import { NegotiationSkeleton } from "@/components/negotiation/negotiation-skeleton";
import { format, formatDistanceToNow, addMinutes } from "date-fns";
import {
    ArrowLeft,
    Clock,
    Tag,
    IndianRupee,
    Calendar,
    Timer,
    Users,
    Wifi,
    WifiOff,
    FileText,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function CountdownTimer({ expiresAt, onTick }: { expiresAt: string, onTick?: (mins: number) => void }) {
    const [timeLeft, setTimeLeft] = useState("");
    const [urgent, setUrgent] = useState(false);

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const end = new Date(expiresAt).getTime();
            const diff = end - now;
            if (diff <= 0) {
                setTimeLeft("Expired");
                return;
            }
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setUrgent(mins < 5);
            setTimeLeft(`${mins}m ${secs}s`);
            if (onTick) onTick(mins);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [expiresAt]);

    return (
        <span className={cn("font-mono font-semibold", urgent ? "text-red-500 animate-pulse" : "text-foreground")}>
            {timeLeft}
        </span>
    );
}

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { showToast } = useActionToast();
    const { subscribe, isConnected } = useWebSocket();

    const [request, setRequest] = useState<Request | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [counterModalOpen, setCounterModalOpen] = useState(false);
    const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
    const [activeExpertName, setActiveExpertName] = useState<string>("");
    const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 5) + 2);
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [minsRemaining, setMinsRemaining] = useState<number>(10);
    const [isCanceling, setIsCanceling] = useState(false);

    const requestId = params?.id as string;

    // Build activity events from offers
    const buildEvents = useCallback((req: Request, offerList: Offer[]): ActivityEvent[] => {
        const evts: ActivityEvent[] = [
            {
                id: `req-${req.id}`,
                type: "request_created",
                actor: "You",
                amount: req.initial_amount,
                timestamp: req.created_at,
            },
        ];
        offerList.forEach((o) => {
            evts.push({
                id: `offer-${o.id}`,
                type: "offer",
                actor: o.expert?.name || `Expert #${o.expert_id}`,
                amount: o.amount,
                message: o.message,
                timestamp: o.created_at,
            });
            if (o.status === "ACCEPTED") {
                evts.push({
                    id: `accepted-${o.id}`,
                    type: "accepted",
                    actor: "You",
                    amount: o.amount,
                    timestamp: o.updated_at,
                });
            }
            if (o.status === "DECLINED") {
                evts.push({
                    id: `declined-${o.id}`,
                    type: "declined",
                    actor: "You",
                    timestamp: o.updated_at,
                });
            }
        });
        return evts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const [reqData, offersData] = await Promise.all([
                getRequest(requestId),
                getRequestOffers(requestId),
            ]);
            setRequest(reqData);
            setOffers(offersData);
            setEvents(buildEvents(reqData, offersData));
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load request details" });
        } finally {
            setLoading(false);
        }
    }, [requestId, toast, buildEvents]);

    const handleAcceptOffer = async (offerId: string) => {
        try {
            await acceptOffer(offerId);
            toast({ title: "Offer Accepted!", description: "The negotiation is complete." });
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to accept offer" });
        }
    };

    const handleDeclineOffer = async (offerId: string) => {
        try {
            await declineOffer(offerId);
            toast({ title: "Offer Declined", description: "The offer has been declined." });
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to decline offer" });
        }
    };

    const handleOpenCounter = (offerId: string, expertName: string) => {
        setActiveOfferId(offerId);
        setActiveExpertName(expertName);
        setCounterModalOpen(true);
    };

    const handleSubmitCounter = async (amount: number, message?: string) => {
        if (!activeOfferId) return;
        await counterOffer(activeOfferId, amount, message);
        toast({ title: "Counter Sent!", description: "Your counter offer has been sent." });
        fetchData();
    };

    const handleCancelRequest = async () => {
        if (!request) return;
        try {
            setIsCanceling(true);
            await cancelRequest(request.id);
            toast({ title: "Request Canceled", description: "You have canceled this request." });
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to cancel request" });
        } finally {
            setIsCanceling(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Simulate viewer count changes
        const viewerInterval = setInterval(() => {
            setViewerCount(Math.floor(Math.random() * 6) + 1);
        }, 8000);

        const unsubscribeOffer = subscribe("NEW_OFFER", async (payload: any) => {
            if (payload.request_id === requestId) {
                showToast({
                    id: payload.offer_id,
                    title: "New Offer Received",
                    description: "An expert has sent you an offer",
                    amount: payload.amount,
                    type: "offer",
                    autoCloseMs: 20000,
                    onAccept: () => handleAcceptOffer(payload.offer_id),
                });
                fetchData();
            }
        });

        const unsubscribeCounter = subscribe("COUNTER_OFFER", (payload: any) => {
            if (payload.request_id === requestId) {
                fetchData();
            }
        });

        const unsubscribeAccepted = subscribe("OFFER_ACCEPTED", () => {
            fetchData();
        });

        const unsubscribeCanceled = subscribe("REQUEST_CANCELED", (payload: any) => {
            if (payload.request_id === requestId) {
                toast({ title: "Request Canceled", description: "This request has been canceled." });
                fetchData();
            }
        });

        const unsubscribeExpired = subscribe("REQUEST_EXPIRED", (payload: any) => {
            if (payload.request_id === requestId) {
                toast({ variant: "destructive", title: "Request Expired", description: "No experts accepted in time. The request was automatically canceled." });
                fetchData();
            }
        });

        return () => {
            unsubscribeOffer();
            unsubscribeCounter();
            unsubscribeAccepted();
            unsubscribeCanceled();
            unsubscribeExpired();
            clearInterval(viewerInterval);
        };
    }, [fetchData, subscribe, requestId, toast, showToast]);

    if (loading) return <NegotiationSkeleton />;
    if (!request) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-muted-foreground">Request not found.</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const isLocked = request.status !== "OPEN";
    const expiresAt = request.expires_at || addMinutes(new Date(request.created_at), 60).toISOString();
    const activeOffer = offers.find((o) => o.id === activeOfferId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/10">
            {/* Header */}
            <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-sm font-semibold leading-tight">Negotiation</h1>
                            <p className="text-xs text-muted-foreground">
                                {request.category?.name || "Request"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* WebSocket status */}
                        <div className={cn(
                            "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full",
                            isConnected
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                        )}>
                            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                            {isConnected ? "Live" : "Offline"}
                        </div>

                        <Badge variant={isLocked ? "secondary" : "default"} className={cn(
                            !isLocked && "bg-indigo-600 hover:bg-indigo-600"
                        )}>
                            {request.status}
                        </Badge>
                        
                        {!isLocked && (
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                className="h-8 text-xs font-semibold"
                                onClick={handleCancelRequest}
                                disabled={isCanceling}
                            >
                                Cancel Request
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Request Summary Card */}
                <Card className="border-0 shadow-md">
                    <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 space-y-3 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-medium border border-indigo-200/60 dark:border-indigo-800">
                                        <Tag className="h-3 w-3" />
                                        {request.category?.name || "Uncategorized"}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                    {request.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
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
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 border border-indigo-100 dark:border-indigo-900 rounded-xl px-4 py-3 text-center">
                                    <p className="text-xs text-muted-foreground mb-0.5">Your Budget</p>
                                    <div className="flex items-center gap-1 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                        <IndianRupee className="h-5 w-5" />
                                        {request.initial_amount.toLocaleString("en-IN")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timer & viewers */}
                        {!isLocked && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t flex-wrap gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Timer className="h-3.5 w-3.5 text-amber-500" />
                                    Expires in&nbsp;
                                    <CountdownTimer expiresAt={expiresAt} onTick={setMinsRemaining} />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        <span className="font-semibold text-foreground">{viewerCount}</span> expert{viewerCount !== 1 ? "s" : ""} reviewing your request
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Main content - offers + timeline */}
                <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                    {/* Offers List */}
                    <div className="space-y-4">
                        {!isLocked && minsRemaining < 5 && offers.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                            >
                                <div>
                                    <h3 className="text-amber-800 dark:text-amber-500 font-semibold text-sm">Not getting any responses?</h3>
                                    <p className="text-amber-700/80 dark:text-amber-600/80 text-xs mt-1">
                                        Experts might be busy or your budget might be too low. Consider canceling and creating a new request with a higher offer.
                                    </p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-500 dark:hover:bg-amber-900/50 whitespace-nowrap"
                                    onClick={handleCancelRequest}
                                    disabled={isCanceling}
                                >
                                    Cancel & Recreate
                                </Button>
                            </motion.div>
                        )}
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-sm flex items-center gap-2">
                                Expert Offers
                                {offers.length > 0 && (
                                    <span className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                                        {offers.length}
                                    </span>
                                )}
                            </h2>
                        </div>

                        <AnimatePresence>
                            {offers.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="rounded-2xl border border-dashed bg-card flex flex-col items-center justify-center py-16 gap-3 text-center"
                                >
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <Users className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">No offers yet</p>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                                            Experts are reviewing your request. Offers will appear here in real-time.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                        Waiting for offers...
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-1">
                                    {offers.map((offer) => (
                                        <OfferCard
                                            key={offer.id}
                                            offer={offer}
                                            isOwner={true}
                                            isLocked={isLocked}
                                            onAccept={handleAcceptOffer}
                                            onDecline={handleDeclineOffer}
                                            onCounter={handleOpenCounter}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Activity Timeline */}
                    <div className="lg:block">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-3 px-5 pt-5">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                                    Activity Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5">
                                <ActivityTimeline events={events} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Counter Offer Modal */}
            <CounterOfferModal
                isOpen={counterModalOpen}
                onClose={() => setCounterModalOpen(false)}
                onSubmit={handleSubmitCounter}
                currentAmount={activeOffer?.amount}
                expertName={activeExpertName}
            />
        </div>
    );
}
