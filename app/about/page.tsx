
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { AboutHero } from "@/components/about/about-hero"
import { OurMission } from "@/components/about/our-mission"
import { TeamSection } from "@/components/about/team-section"
import { StatsSection } from "@/components/about/stats-section"
import { StorySection } from "@/components/about/story-section"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us | Nexus",
    description: "Learn more about our mission to connect you with verified experts.",
}

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <AboutHero />
                <StatsSection />
                <OurMission />
                <StorySection />
                <TeamSection />
            </main>
            <SiteFooter />
        </div>
    )
}
