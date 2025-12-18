import { Zap, Shield, Globe, Clock, Smartphone, Award } from "lucide-react"

const features = [
    {
        icon: Shield,
        title: "Secure Authentication",
        description: "Enterprise-grade security to protect your data and privacy at all times.",
    },
    {
        icon: Zap,
        title: "Fast Booking",
        description: "Book appointments in under 30 seconds with our optimized scheduling engine.",
    },
    {
        icon: Globe,
        title: "Global Access",
        description: "Connect with experts from around the world without geographical barriers.",
    },
    {
        icon: Clock,
        title: "Real-time Availability",
        description: "See up-to-the-minute availability to avoid conflicts and double bookings.",
    },
    {
        icon: Smartphone,
        title: "Mobile Friendly",
        description: "Access Nexus seamlessly from your phone, tablet, or desktop computer.",
    },
    {
        icon: Award,
        title: "Verified Experts",
        description: "All experts undergo a rigorous verification process to ensure quality.",
    },
]

export function FeaturesSection() {
    return (
        <section className="container px-4 md:px-6 py-12 md:py-24">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Nexus?</h2>
                <p className="max-w-[700px] text-muted-foreground">
                    Built for reliability, speed, and user experience.
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
