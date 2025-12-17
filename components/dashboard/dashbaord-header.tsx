import Link from "next/link"
import { UserNav } from "./user-nav"
import type { User } from "@/lib/auth"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-xl font-bold">ExpertBook</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/experts"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Find Experts
            </Link>
            <Link
              href="/dashboard/appointments"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Sessions
            </Link>
          </nav>

          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
