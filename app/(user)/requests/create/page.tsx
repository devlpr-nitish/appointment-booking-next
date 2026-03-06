"use client";

import { CreateRequestForm } from "@/components/negotiation/create-request-form";
import { Sparkles, Zap, Shield } from "lucide-react";

const features = [
    { icon: Sparkles, title: "Real-time Offers", desc: "Experts respond to your request instantly." },
    { icon: Zap, title: "Negotiate Freely", desc: "Counter, accept or decline any offer." },
    { icon: Shield, title: "Secure Booking", desc: "Your payment is protected until service delivery." },
];

export default function CreateRequestPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-10 max-w-5xl">
                <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
                    {/* Left column - info */}
                    <div className="space-y-8 lg:sticky lg:top-10">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Experts online now
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                                Post a Request,
                                <br />
                                <span className="text-primary">
                                    Get Expert Offers
                                </span>
                            </h1>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                Describe what you need and your budget. Experts will send you competing offers — you choose the best deal.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {features.map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{title}</p>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Decorative card */}
                        <div className="hidden lg:block rounded-2xl border bg-card/50 backdrop-blur p-5 space-y-4">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">How it works</p>
                            <div className="space-y-3">
                                {["Post your request & budget", "Receive expert offers in seconds", "Negotiate, accept, and book"].map((step, i) => (
                                    <div key={step} className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - form */}
                    <div className="bg-card rounded-2xl border shadow-sm p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold tracking-tight">Create New Request</h2>
                            <p className="text-sm text-muted-foreground mt-1">Fill in your service details and proposed budget.</p>
                        </div>
                        <CreateRequestForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
