"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useSession } from "@/components/providers/session-provider"
import { UserNav } from "@/components/user/user-nav"
import { useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"

export function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user } = useSession()
    const router = useRouter()

    const handleLogout = async () => {
        await logoutAction()
        router.push("/")
        router.refresh()
        setMobileMenuOpen(false)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        {/* <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" /> */}
                        {/* Using the generated logo. Assuming it's white, we might need a dark version for light mode header using invert filter or similar */}
                        {/* <div className="relative h-8 w-8 overflow-hidden">
                            <img src="/logo.png" alt="Nexus Logo" className="h-full w-full object-contain invert dark:invert-0" />
                        </div> */}
                        <span className="text-xl font-bold">Nexus</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:items-center md:gap-6">
                        <Link
                            href="#experts"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Find Experts
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Become an Expert
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    <div className="hidden md:flex md:items-center md:gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/user" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                    Dashboard
                                </Link>
                                <UserNav user={user} />
                            </div>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/40">
                        <nav className="flex flex-col gap-4">
                            <Link href="#experts" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Find Experts
                            </Link>
                            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                How It Works
                            </Link>
                            <Link href="/signup" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Become an Expert
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Contact
                            </Link>
                            <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                                {user ? (
                                    <>
                                        <div className="px-2 py-2 mb-2 font-medium">
                                            Signed in as {user.name}
                                        </div>
                                        <Button variant="ghost" asChild className="w-full justify-start">
                                            <Link href="/user">Dashboard</Link>
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                                            Log out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="ghost" asChild className="w-full">
                                            <Link href="/login">Sign In</Link>
                                        </Button>
                                        <Button asChild className="w-full">
                                            <Link href="/signup">Get Started</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
