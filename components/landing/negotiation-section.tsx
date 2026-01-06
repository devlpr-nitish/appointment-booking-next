import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandshakeIcon, DollarSign, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        icon: MessageSquare,
        title: "1. Create a Request",
        description: "Post your service request with your proposed budget and requirements",
    },
    {
        icon: DollarSign,
        title: "2. Receive Offers",
        description: "Experts review your request and send counter-offers in real-time",
    },
    {
        icon: HandshakeIcon,
        title: "3. Negotiate & Accept",
        description: "Compare offers and accept the one that best fits your needs",
    },
    {
        icon: CheckCircle,
        title: "4. Get Started",
        description: "Once accepted, connect with your expert and begin your session",
    },
];

export function NegotiationSection() {
    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                        Request & Negotiate with Experts
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Post your requirements and let experts compete for your business. Get the best value through transparent negotiation.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {steps.map((step, index) => (
                        <Card key={step.title} className="relative">
                            <CardHeader>
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <step.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg text-center">{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center leading-relaxed">
                                    {step.description}
                                </CardDescription>
                            </CardContent>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/20" />
                            )}
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/requests/create">
                            <HandshakeIcon className="h-5 w-5" />
                            Create Your First Request
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
