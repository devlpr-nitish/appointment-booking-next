import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ExpertsSection } from "@/components/landing/experts-section"
import { CTASection } from "@/components/landing/cta-section"
import { getFeaturedExperts } from "@/lib/data/experts"

export default async function HomePage() {
  const experts = await getFeaturedExperts(6)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ExpertsSection experts={experts} />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
