import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Connect with verified experts</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
            Book 1-on-1 Sessions with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Verified Experts
            </span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground text-balance md:text-xl leading-relaxed max-w-2xl mx-auto">
            Get personalized guidance from industry professionals. Whether you need career advice, technical mentorship,
            or business strategy, connect with the right expert for you.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="text-base">
              <Link href="#experts">
                Find an Expert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
              <Link href="/signup">Become an Expert</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div>
              <div className="text-3xl font-bold text-foreground md:text-4xl">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Verified Experts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground md:text-4xl">10k+</div>
              <div className="text-sm text-muted-foreground mt-1">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground md:text-4xl">4.9</div>
              <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
