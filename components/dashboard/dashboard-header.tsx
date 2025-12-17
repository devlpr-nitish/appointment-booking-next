
import Link from "next/link"
import { UserNav } from "@/components/dashboard/user-nav"
import type { User } from "@/lib/auth"

interface DashboardHeaderProps {
    user?: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden">
                            <img src="/logo.png" alt="Nexus Logo" className="h-full w-full object-contain invert dark:invert-0" />
                        </div>
                        <span className="text-xl font-bold">Nexus</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/appointments"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            My Bookings
                        </Link>
                        <Link
                            href="/experts"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Find Experts
                        </Link>
                    </nav>

                    {user && <UserNav user={user} />}
                </div>
            </div>
        </header>
    )
}
