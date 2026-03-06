"use client";

import { Offer, ExpertInfo } from "@/lib/data/negotiation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, CheckCircle2, XCircle, RefreshCw, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface OfferCardProps {
    offer: Offer;
    isOwner: boolean;
    isLocked: boolean;
    onAccept: (offerId: string) => void;
    onDecline: (offerId: string) => void;
    onCounter: (offerId: string, expertName: string) => void;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "h-3.5 w-3.5",
                        i < Math.round(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                    )}
                />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
        </div>
    );
}

export function OfferCard({ offer, isOwner, isLocked, onAccept, onDecline, onCounter }: OfferCardProps) {
    const expert: ExpertInfo = offer.expert || {
        id: offer.expert_id,
        name: "Expert",
        email: "",
        avatar: undefined,
        rating: 4.5,
        expertise: "Specialist",
        reviewCount: 0,
    };

    const safeName = expert.name || "Expert";
    const initials = safeName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const isPending = offer.status === "PENDING";
    const isAccepted = offer.status === "ACCEPTED";
    const isDeclined = offer.status === "DECLINED";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className={cn(
                    "relative overflow-hidden border transition-all duration-300",
                    isAccepted && "border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-emerald-100 dark:shadow-emerald-900/20 shadow-lg",
                    isDeclined && "border-red-200/60 opacity-60",
                    isPending && !isLocked && "hover:shadow-md hover:border-indigo-200/60 cursor-default",
                )}
            >
                {isAccepted && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-xl" />
                )}

                <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <Avatar className="h-12 w-12 border-2 border-border">
                                <AvatarImage src={expert.avatar} alt={expert.name} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-sm">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {isAccepted && (
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-white dark:bg-card p-0.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                                </div>
                            )}
                        </div>

                        {/* Expert info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div>
                                    <h3 className="font-semibold text-sm leading-tight">{expert.name}</h3>
                                    <p className="text-xs text-muted-foreground">{expert.expertise || "Expert"}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="flex items-center justify-end gap-1 font-bold text-xl text-foreground">
                                        <IndianRupee className="h-4 w-4" />
                                        <span>{offer.amount.toLocaleString("en-IN")}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(offer.created_at), "h:mm a")}
                                    </p>
                                </div>
                            </div>

                            {expert.rating !== undefined && (
                                <div className="mt-1">
                                    <StarRating rating={expert.rating} />
                                </div>
                            )}

                            {offer.message && (
                                <div className="mt-3 flex gap-2 items-start bg-muted/50 rounded-lg p-2.5">
                                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-muted-foreground leading-relaxed">{offer.message}</p>
                                </div>
                            )}

                            {/* Status badge or actions */}
                            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                                {isAccepted && (
                                    <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 dark:text-emerald-400 hover:bg-emerald-500/10">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Accepted
                                    </Badge>
                                )}
                                {isDeclined && (
                                    <Badge variant="outline" className="text-red-500 border-red-200">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Declined
                                    </Badge>
                                )}
                                {isPending && !isLocked && isOwner && (
                                    <div className="flex gap-1.5 flex-wrap w-full">
                                        <Button
                                            size="sm"
                                            className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => onAccept(offer.id)}
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 h-8 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400"
                                            onClick={() => onCounter(offer.id, expert.name)}
                                        >
                                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                            Counter
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                                            onClick={() => onDecline(offer.id)}
                                        >
                                            <XCircle className="h-3.5 w-3.5 mr-1" />
                                            Decline
                                        </Button>
                                    </div>
                                )}
                                {isPending && isLocked && (
                                    <Badge variant="secondary" className="text-xs">Pending</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
