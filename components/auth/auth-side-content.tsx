
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

export function AuthSideContent() {
    const pathname = usePathname()
    const isLogin = pathname === "/login"

    return (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden">
                        <img src="/logo.png" alt="Nexus Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Nexus</span>
                </Link>
            </div>

            <div className="relative z-20 mt-auto mb-auto">
                {isLogin ? (
                    <>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome Back to Nexus</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Reconnect with your mentors and continue your professional growth journey. Not a member yet?{" "}
                            <Link href="/signup" className="text-primary hover:text-accent font-medium">
                                Join now
                            </Link>
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <div>
                                    <h3 className="font-semibold text-white">Track Your Progress</h3>
                                    <p className="text-sm text-muted-foreground">
                                        View upcoming sessions and review past learnings from your dashboard.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <div>
                                    <h3 className="font-semibold text-white">New Experts Added Weekly</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Explore our growing network of industry leaders in tech, business, and creative fields.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Start Your Learning Journey</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Create an account to access 1-on-1 mentorship from world-class professionals. Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:text-accent font-medium">
                                Log in
                            </Link>
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <div>
                                    <h3 className="font-semibold text-white">Curated Expert Network</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Connect with verified experts who have "been there, done that" at top companies.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <div>
                                    <h3 className="font-semibold text-white">Flexible Scheduling</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Book sessions that fit your schedule with our easy-to-use calendar.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <div>
                                    <h3 className="font-semibold text-white">Satisfaction Guaranteed</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We ensure high-quality sessions. If you're not satisfied, we'll make it right.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                <p className="text-sm font-medium text-muted-foreground">Trusted by professionals from</p>
                <div className="flex gap-4 text-white/50">
                    {/* Simple text placeholders for logos */}
                    <span className="font-bold">GOOGLE</span>
                    <span className="font-bold">MICROSOFT</span>
                    <span className="font-bold">STRIPE</span>
                    <span className="font-bold">AMAZON</span>
                </div>
                <div className="mt-4 flex gap-8">
                    <div>
                        <p className="text-2xl font-bold text-white">10k+</p>
                        <p className="text-xs text-muted-foreground">Sessions Booked</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">500+</p>
                        <p className="text-xs text-muted-foreground">Verified Experts</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">4.9/5</p>
                        <p className="text-xs text-muted-foreground">Average Rating</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
