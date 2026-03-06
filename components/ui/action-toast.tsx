"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, IndianRupee, HandshakeIcon, Sparkles, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActionToastProps {
    id: string;
    title: string;
    description: string;
    amount?: number;
    categoryName?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    onDismiss: () => void;
    autoCloseMs?: number;
    type: "request" | "offer";
}

export function ActionToast({
    id,
    title,
    description,
    amount,
    categoryName,
    onAccept,
    onDecline,
    onDismiss,
    autoCloseMs = 15000,
    type,
}: ActionToastProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(autoCloseMs / 1000);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const startTime = Date.now();
        const timer = setTimeout(() => onDismiss(), autoCloseMs);

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, autoCloseMs - elapsed);
            setTimeLeft(Math.ceil(remaining / 1000));
            setProgress((remaining / autoCloseMs) * 100);
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [autoCloseMs, onDismiss]);

    const handleViewDetails = () => {
        if (type === "request") {
            router.push(`/expert/requests/${id}`);
        } else {
            router.push(`/requests/${id}`);
        }
        onDismiss();
    };

    const isRequest = type === "request";

    return (
        <div className={cn(
            "relative w-full max-w-sm rounded-xl border shadow-xl overflow-hidden",
            "bg-card backdrop-blur-sm",
            "animate-in slide-in-from-right duration-300",
        )}>
            {/* Progress bar */}
            <div
                className={cn(
                    "absolute top-0 left-0 h-0.5 transition-all duration-100",
                    isRequest ? "bg-indigo-500" : "bg-emerald-500"
                )}
                style={{ width: `${progress}%` }}
            />

            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            isRequest
                                ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                                : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                        )}>
                            {isRequest ? (
                                <HandshakeIcon className="h-4 w-4" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold leading-tight">{title}</p>
                            <p className="text-xs text-muted-foreground leading-tight mt-0.5">{description}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-foreground flex-shrink-0"
                        onClick={onDismiss}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Details */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {categoryName && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            {categoryName}
                        </Badge>
                    )}
                    {amount !== undefined && (
                        <div className="flex items-center gap-0.5 text-base font-bold">
                            <IndianRupee className="h-3.5 w-3.5" />
                            {amount.toLocaleString("en-IN")}
                        </div>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                        {timeLeft}s
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 text-xs gap-1"
                        onClick={handleViewDetails}
                    >
                        <ExternalLink className="h-3 w-3" />
                        View
                    </Button>
                    {onDecline && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                            onClick={() => { onDecline(); onDismiss(); }}
                        >
                            Decline
                        </Button>
                    )}
                    {onAccept && (
                        <Button
                            size="sm"
                            className="flex-1 h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => { onAccept(); onDismiss(); }}
                        >
                            Accept
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
