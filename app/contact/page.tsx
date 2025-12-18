import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ContactForm } from "@/components/contact/contact-form"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
                        <p className="mt-4 text-muted-foreground md:text-xl">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
                            <ContactForm />
                        </div>

                        <div className="space-y-8">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-6 w-6 text-primary shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Office Address</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                123 Innovation Drive<br />
                                                Tech Valley, CA 94043
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Mail className="h-6 w-6 text-primary shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Email</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                hello@nexus-experts.com
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="h-6 w-6 text-primary shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Phone</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                +1 (555) 123-4567
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span>9:00 AM - 6:00 PM PST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span>10:00 AM - 4:00 PM PST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span>Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    )
}
