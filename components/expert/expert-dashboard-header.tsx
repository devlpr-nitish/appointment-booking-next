import Link from "next/link"
import { ExpertNav } from "@/components/expert/expert-nav"
import type { User } from "@/lib/auth"

interface ExpertDashboardHeaderProps {
    user: User
}

export function ExpertDashboardHeader({ user }: ExpertDashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/expert" className="flex items-center gap-2">
                        {/* <div className="relative h-8 w-8 overflow-hidden">
                            <img src="/logo.png" alt="Nexus Logo" className="h-full w-full object-contain invert dark:invert-0" />
                        </div> */}
                        <span className="text-xl font-bold">Nexus</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/expert"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/expert/sessions"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sessions
                        </Link>
                        <Link
                            href="/expert/availability"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Availability
                        </Link>
                        <Link
                            href="/expert/profile"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Profile
                        </Link>
                    </nav>

                    <ExpertNav user={user} />
                </div>
            </div>
        </header>
    )
}
