"use client";

import { ActivityEvent } from "@/lib/data/negotiation";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    XCircle,
    RefreshCw,
    IndianRupee,
    ArrowUpCircle,
    Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityTimelineProps {
    events: ActivityEvent[];
}

function getEventIcon(type: ActivityEvent["type"]) {
    switch (type) {
        case "offer":
            return <IndianRupee className="h-3.5 w-3.5" />;
        case "counter":
            return <RefreshCw className="h-3.5 w-3.5" />;
        case "accepted":
            return <CheckCircle2 className="h-3.5 w-3.5" />;
        case "declined":
            return <XCircle className="h-3.5 w-3.5" />;
        case "request_created":
            return <ArrowUpCircle className="h-3.5 w-3.5" />;
        default:
            return <Sparkles className="h-3.5 w-3.5" />;
    }
}

function getEventColor(type: ActivityEvent["type"]) {
    switch (type) {
        case "offer":
            return "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400";
        case "counter":
            return "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400";
        case "accepted":
            return "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";
        case "declined":
            return "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400";
        case "request_created":
            return "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400";
        default:
            return "bg-muted text-muted-foreground";
    }
}

function getEventText(event: ActivityEvent): string {
    switch (event.type) {
        case "request_created":
            return `You created a request`;
        case "offer":
            return `${event.actor} offered ₹${event.amount?.toLocaleString("en-IN")}`;
        case "counter":
            return `${event.actor} countered with ₹${event.amount?.toLocaleString("en-IN")}`;
        case "accepted":
            return `${event.actor} accepted the offer of ₹${event.amount?.toLocaleString("en-IN")}`;
        case "declined":
            return `${event.actor} declined the offer`;
        default:
            return event.actor;
    }
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No activity yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        className="flex items-start gap-3"
                    >
                        {/* Icon bubble */}
                        <div
                            className={cn(
                                "flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center mt-0.5",
                                getEventColor(event.type)
                            )}
                        >
                            {getEventIcon(event.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug">{getEventText(event)}</p>
                            {event.message && (
                                <p className="text-xs text-muted-foreground mt-0.5 italic">"{event.message}"</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {format(new Date(event.timestamp), "h:mm a, MMM d")}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
