
import { ExpertCard } from "@/components/landing/expert-card"
import type { Expert } from "@/lib/data/experts"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ExpertsSectionProps {
    experts: Expert[]
}

export function ExpertsSection({ experts }: ExpertsSectionProps) {
    return (
        <section id="experts" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">Find an Expert</h2>
                    <p className="text-muted-foreground text-lg">
                        Browse through our network of verified professionals and find the perfect match for your needs.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {experts.map((expert) => (
                        <ExpertCard key={expert.id} expert={expert} />
                    ))}
                </div>

                <div className="text-center">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/experts">View All Experts</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
