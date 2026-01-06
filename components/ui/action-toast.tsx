"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, DollarSign, User, HandshakeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
    autoCloseMs = 15000, // 15 seconds default
    type,
}: ActionToastProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(autoCloseMs / 1000);

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, autoCloseMs);

        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

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

    return (
        <Card className="w-full max-w-md shadow-lg border-2 border-primary/20 animate-in slide-in-from-right">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {type === "request" ? (
                            <HandshakeIcon className="h-5 w-5 text-primary" />
                        ) : (
                            <DollarSign className="h-5 w-5 text-primary" />
                        )}
                        <CardTitle className="text-lg">{title}</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onDismiss}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 pb-3">
                {categoryName && (
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{categoryName}</Badge>
                    </div>
                )}
                {amount !== undefined && (
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
                    </div>
                )}
                <div className="text-xs text-muted-foreground">
                    Auto-closes in {timeLeft}s
                </div>
            </CardContent>

            <CardFooter className="flex gap-2 pt-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleViewDetails}
                >
                    View Details
                </Button>
                {onDecline && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                            onDecline();
                            onDismiss();
                        }}
                    >
                        Decline
                    </Button>
                )}
                {onAccept && (
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                            onAccept();
                            onDismiss();
                        }}
                    >
                        Accept
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
