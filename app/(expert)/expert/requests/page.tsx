"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Request, getExpertRequests, getRequest, createOffer } from "@/lib/data/negotiation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useActionToast } from "@/components/providers/action-toast-provider";
import { CounterOfferModal } from "@/components/negotiation/counter-offer-modal";
import { ExpertRequestSkeleton } from "@/components/negotiation/negotiation-skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { useWebSocket } from "@/components/providers/websocket-provider";
import {
    Inbox,
    Tag,
    Calendar,
    Clock,
    IndianRupee,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Wifi,
    WifiOff,
    Send,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RequestCardProps {
    request: Request;
    offerSent: boolean;
    onAccept: (reqId: string, amount: number) => Promise<void>;
    onCounter: (reqId: string, amount: number) => void;
    onIgnore: (reqId: string) => void;
}

function ExpertRequestCard({ request, offerSent, onAccept, onCounter, onIgnore }: RequestCardProps) {
    const [isAccepting, setIsAccepting] = useState(false);
    const [isIgnored, setIsIgnored] = useState(false);

    const handleAccept = async () => {
        setIsAccepting(true);
        await onAccept(request.id, request.initial_amount);
        setIsAccepting(false);
    };

    if (isIgnored) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
        >
            <Card className={cn(
                "border transition-all duration-300",
                offerSent
                    ? "border-emerald-300/60 bg-emerald-50/30 dark:bg-emerald-950/10"
                    : "hover:shadow-md hover:border-indigo-200/60"
            )}>
                {offerSent && (
                    <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-xl" />
                )}
                <CardHeader className="px-5 pt-5 pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full font-medium border border-indigo-200/50">
                                    <Tag className="h-3 w-3" />
                                    {request.category?.name || "Uncategorized"}
                                </div>
                                {offerSent && (
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300/60 hover:bg-emerald-100 text-xs dark:bg-emerald-950 dark:text-emerald-400">
                                        <Send className="h-2.5 w-2.5 mr-1" />
                                        Offer Sent
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {request.description}
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <div className="flex items-center gap-0.5 text-xl font-bold text-foreground justify-end">
                                <IndianRupee className="h-4 w-4" />
                                {request.initial_amount.toLocaleString("en-IN")}
                            </div>
                            <p className="text-xs text-muted-foreground">Proposed</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-5 pb-3">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {request.preferred_time && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(request.preferred_time), "MMM d, h:mm a")}
                            </div>
                        )}
                        {request.duration && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {request.duration} min
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-5 pb-5">
                    {!offerSent ? (
                        <div className="flex gap-2 w-full">
                            <Button
                                size="sm"
                                className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={handleAccept}
                                disabled={isAccepting}
                            >
                                {isAccepting ? (
                                    <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                        Accept Price
                                    </>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-8 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400"
                                onClick={() => onCounter(request.id, request.initial_amount)}
                            >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                Counter
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                onClick={() => {
                                    setIsIgnored(true);
                                    onIgnore(request.id);
                                }}
                            >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Ignore
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2 w-full">
                            <Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                <Link href={`/expert/requests/${request.id}`}>View Details</Link>
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default function ExpertRequestsPage() {
    const { toast } = useToast();
    const { showToast } = useActionToast();
    const { subscribe, isConnected } = useWebSocket();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [offerSentIds, setOfferSentIds] = useState<Set<string>>(new Set());
    const [counterModalOpen, setCounterModalOpen] = useState(false);
    const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
    const [activeAmount, setActiveAmount] = useState<number>(0);

    const fetchData = useCallback(async () => {
        try {
            const data = await getExpertRequests();
            setRequests(data);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load requests" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleAcceptPrice = async (reqId: string, amount: number) => {
        try {
            await createOffer(reqId, amount, "Happy to work at your proposed price!");
            setOfferSentIds((prev) => new Set([...prev, reqId]));
            toast({ title: "Offer Sent!", description: "You accepted the proposed price." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message || "Failed" });
        }
    };

    const handleOpenCounter = (reqId: string, amount: number) => {
        setActiveRequestId(reqId);
        setActiveAmount(amount);
        setCounterModalOpen(true);
    };

    const handleSubmitCounter = async (amount: number, message?: string) => {
        if (!activeRequestId) return;
        await createOffer(activeRequestId, amount, message);
        setOfferSentIds((prev) => new Set([...prev, activeRequestId]));
        toast({ title: "Counter Offer Sent!", description: "Your offer has been sent to the user." });
    };

    const handleIgnore = (reqId: string) => {
        toast({ title: "Request Ignored", description: "You've hidden this request." });
    };

    useEffect(() => {
        fetchData();

        const unsubscribe = subscribe("NEW_REQUEST", async (payload: any) => {
            try {
                const requestDetails = await getRequest(payload.request_id);
                showToast({
                    id: payload.request_id,
                    title: "New Request Available!",
                    description: requestDetails.description || "A new request matches your expertise",
                    amount: requestDetails.initial_amount,
                    categoryName: requestDetails.category?.name,
                    type: "request",
                    autoCloseMs: 15000,
                });
                fetchData();
            } catch {
                toast({ title: "New Request", description: "A new request matches your expertise." });
                fetchData();
            }
        });

        return () => unsubscribe();
    }, [fetchData, subscribe, toast, showToast]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/10">
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Incoming Requests</h1>
                            {requests.length > 0 && (
                                <span className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                                    {requests.length}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Requests matching your expertise in real-time.
                        </p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium",
                        isConnected
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900"
                            : "bg-muted text-muted-foreground border"
                    )}>
                        {isConnected ? (
                            <>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Live Updates
                            </>
                        ) : (
                            <>
                                <WifiOff className="h-3 w-3" />
                                Reconnecting...
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <ExpertRequestSkeleton />
                ) : requests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-2xl border border-dashed bg-card"
                    >
                        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                            <Inbox className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">No requests yet</p>
                            <p className="text-sm text-muted-foreground max-w-[260px]">
                                New requests matching your expertise will appear here instantly.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Listening for new requests...
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {requests.map((req) => (
                                <ExpertRequestCard
                                    key={req.id}
                                    request={req}
                                    offerSent={offerSentIds.has(req.id)}
                                    onAccept={handleAcceptPrice}
                                    onCounter={handleOpenCounter}
                                    onIgnore={handleIgnore}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <CounterOfferModal
                isOpen={counterModalOpen}
                onClose={() => setCounterModalOpen(false)}
                onSubmit={handleSubmitCounter}
                currentAmount={activeAmount}
                isExpertSide
            />
        </div>
    );
}
