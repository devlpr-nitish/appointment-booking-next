import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandshakeIcon, DollarSign, MessageSquare, CheckCircle, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

const workflow = [
    {
        step: "1",
        icon: MessageSquare,
        title: "Post Your Request",
        description: "Create a detailed request with your requirements, budget, and timeline. Specify the category and what you're looking for.",
        userAction: "User Action",
    },
    {
        step: "2",
        icon: Bell,
        title: "Experts Get Notified",
        description: "Qualified experts in your category receive instant notifications about your request via real-time WebSocket updates.",
        userAction: "System Action",
    },
    {
        step: "3",
        icon: DollarSign,
        title: "Receive Counter-Offers",
        description: "Experts review your request and send their proposals. You'll see offers appear in real-time as they come in.",
        userAction: "Expert Action",
    },
    {
        step: "4",
        icon: HandshakeIcon,
        title: "Compare & Negotiate",
        description: "Review all offers side-by-side. Compare pricing, expert profiles, and ratings to find the best match for your needs.",
        userAction: "User Action",
    },
    {
        step: "5",
        icon: CheckCircle,
        title: "Accept & Connect",
        description: "Once you accept an offer, the request is locked and you're connected with your chosen expert to begin your session.",
        userAction: "User Action",
    },
];

export function NegotiationWorkflowSection() {
    return (
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                        <HandshakeIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Request & Negotiate</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                        How the Negotiation Process Works
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Get competitive offers from multiple experts and choose the one that best fits your budget and requirements.
                        Transparent pricing, real-time updates, and complete control over your selection.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {workflow.map((item, index) => (
                        <div key={item.step} className="relative">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
                                                {item.step}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <item.icon className="h-5 w-5 text-primary" />
                                                <CardTitle className="text-xl">{item.title}</CardTitle>
                                            </div>
                                            <div className="inline-flex px-2 py-1 rounded text-xs font-medium bg-muted">
                                                {item.userAction}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {item.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            {index < workflow.length - 1 && (
                                <div className="flex justify-center my-4">
                                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-muted/50">
                        <Bell className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">
                            All updates happen in real-time via WebSocket connections
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/requests/create">
                                <HandshakeIcon className="h-5 w-5" />
                                Create Your First Request
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/experts">
                                Browse Experts
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
