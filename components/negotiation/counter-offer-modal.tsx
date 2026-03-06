"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndianRupee, RefreshCw } from "lucide-react";

interface CounterOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, message?: string) => Promise<void>;
    currentAmount?: number;
    expertName?: string;
    isExpertSide?: boolean;
}

export function CounterOfferModal({
    isOpen,
    onClose,
    onSubmit,
    currentAmount,
    expertName,
    isExpertSide = false,
}: CounterOfferModalProps) {
    const [amount, setAmount] = useState(currentAmount?.toString() || "");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            setError("Please enter a valid amount greater than 0");
            return;
        }
        setError("");
        setIsLoading(true);
        try {
            await onSubmit(numAmount, message || undefined);
            setAmount("");
            setMessage("");
            onClose();
        } catch (e: any) {
            setError(e.message || "Failed to submit");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setAmount(currentAmount?.toString() || "");
        setMessage("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-indigo-500" />
                        {isExpertSide ? "Send Counter Offer" : `Counter ${expertName ? `${expertName}'s` : ""} Offer`}
                    </DialogTitle>
                    <DialogDescription>
                        {currentAmount
                            ? `Current offer is ₹${currentAmount.toLocaleString("en-IN")}. Enter your counter-offer price.`
                            : "Enter your proposed price for this service."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="counter-amount">
                            {isExpertSide ? "Your Price (₹)" : "Your Counter Price (₹)"}
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                                id="counter-amount"
                                type="number"
                                placeholder="0"
                                className="pl-9 text-base font-semibold"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="counter-message">
                            Message <span className="text-xs text-muted-foreground">(optional)</span>
                        </Label>
                        <Textarea
                            id="counter-message"
                            placeholder={
                                isExpertSide
                                    ? "Explain your pricing or availability..."
                                    : "Explain why you're countering..."
                            }
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="resize-none text-sm"
                            rows={3}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !amount}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-1.5">
                                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Sending...
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <RefreshCw className="h-3.5 w-3.5" />
                                Send Counter Offer
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
