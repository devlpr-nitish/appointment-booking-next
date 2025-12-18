import { Badge } from "@/components/ui/badge"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-16 text-center">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                        Simple & Efficient
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        How Nexus Works
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Your journey to expert guidance in 5 simple steps. Whether you're seeking advice or sharing knowledge, we make it seamless.
                    </p>
                </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </section>
    )
}
