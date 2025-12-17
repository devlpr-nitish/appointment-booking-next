import { ExpertCard } from "./expert-card"
import type { Expert } from "@/lib/data/experts"

interface ExpertsSectionProps {
  experts: Expert[]
}

export function ExpertsSection({ experts }: ExpertsSectionProps) {
  return (
    <section id="experts" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Featured Experts</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our community of verified professionals ready to help you achieve your goals
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  )
}
