
import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

const team = [
    {
        name: "Alex Morgan",
        role: "CEO & Co-Founder",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
        bio: "Visionary leader with a passion for connecting people and technology."
    },
    {
        name: "Sarah Chen",
        role: "CTO",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
        bio: "Tech veteran bringing scalable solutions to complex problems."
    },
    {
        name: "Marcus Johnson",
        role: "Head of Product",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
        bio: "Product strategist focused on delivering exceptional user experiences."
    },
    {
        name: "Emily Davis",
        role: "Head of Community",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
        bio: "Building vibrant communities where experts and learners thrive."
    }
]

export function TeamSection() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Meet the Team
                    </h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                        The passionate individuals behind the platform dedicated to your success.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {team.map((member, index) => (
                        <div key={index} className="group flex flex-col items-center text-center">
                            <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-muted transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/20">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                            <p className="mb-2 text-sm font-medium text-primary">{member.role}</p>
                            <p className="mb-4 text-sm text-muted-foreground">{member.bio}</p>

                            <div className="flex gap-4 opacity-60 transition-opacity hover:opacity-100">
                                <Link href="#" className="text-muted-foreground hover:text-primary">
                                    <Linkedin className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary">
                                    <Github className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
