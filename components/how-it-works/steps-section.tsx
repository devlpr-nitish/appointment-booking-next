import { UserPlus, Search, CalendarCheck, Settings, Bell } from "lucide-react"

const steps = [
    {
        icon: UserPlus,
        title: "1. Sign Up & Login",
        description: "Create your account in seconds. Choose your role as a Customer to seek advice or as an Expert to offer your services.",
    },
    {
        icon: Search,
        title: "2. Browse Services",
        description: "Explore our diverse marketplace of verified experts. Filter by category, price, and availability to find your perfect match.",
    },
    {
        icon: CalendarCheck,
        title: "3. Book Appointment",
        description: "Select a date and time that works for you. details and confirm your booking instantly.",
    },
    {
        icon: Settings,
        title: "4. Manage Appointments",
        description: "Keep track of your upcoming sessions. Reschedule if needed and manage your bookings from a simple dashboard.",
    },
    {
        icon: Bell,
        title: "5. Stay Updated",
        description: "Receive instant notifications for booking confirmations, reminders, and status updates so you never miss a session.",
    },
]

export function StepsSection() {
    return (
        <section className="container px-4 md:px-6 py-12 md:py-24">
            <div className="grid gap-12">
                <div className="flex flex-col items-center gap-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Step-by-Step Flow</h2>
                    <p className="max-w-[700px] text-muted-foreground">
                        From your first click to your first session, here is what you can expect.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <step.icon className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-[calc(100%+1.5rem)] w-12 border-t-2 border-dashed border-border/50" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
