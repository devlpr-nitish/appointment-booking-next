import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
    return (
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
            <div className="container px-4 md:px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                    Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl mb-8">
                    Join thousands of users who are already learning, growing, and succeeding with Nexus.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild className="font-semibold text-lg px-8">
                        <Link href="/signup">Get Started Now</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold text-lg px-8" asChild>
                        <Link href="/experts">Browse Experts</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
