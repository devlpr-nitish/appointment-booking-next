
import { Calendar, CheckCircle2, Flag } from "lucide-react"

export function StorySection() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 md:grid-cols-2 items-center">

                    <div className="relative order-2 md:order-1">
                        <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-accent/20 blur-3xl opacity-50" />
                        <div className="relative space-y-8 border-l-2 border-muted pl-8 ml-4 md:ml-0">

                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary text-primary">
                                    <Flag className="h-4 w-4" />
                                </span>
                                <h3 className="text-lg font-bold text-foreground">2023 - The Beginning</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Founded with a simple idea: make expert knowledge accessible to everyone. We started with just 10 experts and a vision.
                                </p>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary text-primary">
                                    <Calendar className="h-4 w-4" />
                                </span>
                                <h3 className="text-lg font-bold text-foreground">2024 - Rapid Growth</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Expanded to 500+ experts and launched our advanced video platform. Helped thousands of users find their mentors.
                                </p>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary text-primary">
                                    <CheckCircle2 className="h-4 w-4" />
                                </span>
                                <h3 className="text-lg font-bold text-foreground">Today - Global Community</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Now a thriving community serving users across 50 countries. We continue to innovate and improve our matching algorithms.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Our Journey
                        </h2>
                        <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                            What started as a frustration with finding reliable mentors has evolved into a global platform. We realized that while information is everywhere,
                            personalized wisdom is scarce.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We are committed to building a future where anyone, anywhere can connect with the experts they need to unlock their full potential.
                            Every line of code we write and every feature we launch is driven by this core belief.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}
