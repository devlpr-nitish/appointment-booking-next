import Link from "next/link"
import { UserNav } from "@/components/user/user-nav"
import type { User } from "@/lib/auth"

interface AdminHeaderProps {
    user: User
}

export function AdminHeader({ user }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden">
                            <img src="/logo.png" alt="Nexus Logo" className="h-full w-full object-contain invert dark:invert-0" />
                        </div>
                        <span className="text-xl font-bold">Nexus Admin</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/users"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Users
                        </Link>
                        <Link
                            href="/admin/experts"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Experts
                        </Link>
                        <Link
                            href="/admin/bookings"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Bookings
                        </Link>
                    </nav>

                    <UserNav user={user} />
                </div>
            </div>
        </header>
    )
}
