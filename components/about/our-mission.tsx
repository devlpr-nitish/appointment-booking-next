
import { Shield, Users, Zap, Globe } from "lucide-react"

const values = [
    {
        icon: Shield,
        title: "Trust & Transparency",
        description: "We verify every expert to ensure legitimate, high-quality guidance for our users."
    },
    {
        icon: Users,
        title: "Community First",
        description: "Building supportive relationships between mentors and mentees is at our core."
    },
    {
        icon: Zap,
        title: "Instant Access",
        description: "Removing barriers to knowledge with seamless booking and video tools."
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Connecting talent across borders, time zones, and industries."
    }
]

export function OurMission() {
    return (
        <section className="bg-muted/30 py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Our Mission & Values
                    </h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                        We believe that everyone deserves access to the right guidance at the right time.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl bg-card p-8 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <value.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-foreground">{value.title}</h3>
                            <p className="text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
