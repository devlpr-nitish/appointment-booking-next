import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { HeroSection } from "@/components/how-it-works/hero-section"
import { StepsSection } from "@/components/how-it-works/steps-section"
import { RolesSection } from "@/components/how-it-works/roles-section"
import { FeaturesSection } from "@/components/how-it-works/features-section"
import { CTASection } from "@/components/how-it-works/cta-section"

export default function HowItWorksPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex flex-col mx-auto">
                <HeroSection />
                <StepsSection />
                <RolesSection />
                <FeaturesSection />
                <CTASection />
            </main>
            <SiteFooter />
        </div>
    )
}
