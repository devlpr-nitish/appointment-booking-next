
export function StatsSection() {
    return (
        <section className="border-y border-border/40 bg-muted/20 py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                    <div className="flex flex-col items-center justify-center p-4">
                        <span className="text-4xl font-black text-primary md:text-5xl">10k+</span>
                        <span className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active Users</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                        <span className="text-4xl font-black text-primary md:text-5xl">500+</span>
                        <span className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">verified Experts</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                        <span className="text-4xl font-black text-primary md:text-5xl">50k+</span>
                        <span className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sessions Booked</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                        <span className="text-4xl font-black text-primary md:text-5xl">4.9/5</span>
                        <span className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Average Rating</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
