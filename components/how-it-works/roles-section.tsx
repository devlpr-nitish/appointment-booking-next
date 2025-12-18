import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, ShieldCheck } from "lucide-react"

export function RolesSection() {
    return (
        <section className="bg-muted/50 py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center gap-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tailored for Everyone</h2>
                    <p className="max-w-[700px] text-muted-foreground">
                        Nexus provides specialized tools for every user type.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle>Customer</CardTitle>
                            <CardDescription>Seekers of knowledge</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground text-left">
                                <li>Browse thousands of verified experts</li>
                                <li>Book appointments instantly</li>
                                <li>Track sessions and view history</li>
                                <li>Secure payments and messaging</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="border-primary/50 bg-primary/5 dark:bg-primary/10">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                                <Briefcase className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>Service Provider</CardTitle>
                            <CardDescription>Experts & Consultants</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground text-left">
                                <li>Create a professional profile</li>
                                <li>Set your own availability and rates</li>
                                <li>Manage bookings and client notes</li>
                                <li>Receive automated payouts</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle>Admin</CardTitle>
                            <CardDescription>Platform Managers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground text-left">
                                <li>Oversee all platform activity</li>
                                <li>Verify expert profiles</li>
                                <li>Manage system settings</li>
                                <li>Resolve support tickets</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
