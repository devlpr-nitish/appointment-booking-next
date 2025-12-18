
export function AboutHero() {
    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            {/* Background Gradients */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
            <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

            <div className="container relative mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                        Our Narrative
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                        Empowering Connections Through <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Expertise</span>
                    </h1>
                    <p className="mb-10 text-xl text-muted-foreground leading-relaxed">
                        We're building the bridge between knowledge seekers and industry leaders.
                        Our mission is to democratize access to world-class mentorship and professional guidance.
                    </p>
                </div>
            </div>
        </section>
    )
}
