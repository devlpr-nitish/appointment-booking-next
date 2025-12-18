import { getExpertById } from "@/lib/data/experts"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"
import { BookingInterface } from "@/components/booking/booking-interface"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Star, Quote } from "lucide-react"

interface BookingPageProps {
    params: Promise<{ id: string }>
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { id } = await params
    const expert = await getExpertById(id)

    if (!expert) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Book a Session</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Booking Interface - Takes up 2 columns on large screens */}
                    <div className="lg:col-span-2">
                        <BookingInterface expert={expert} />
                    </div>

                    {/* Sidebar - Expert Info & Reviews - Takes up 1 column */}
                    <div className="space-y-6">
                        {/* Expert Info Card */}
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={expert.imageUrl} alt={expert.name} />
                                        <AvatarFallback>{expert.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-bold text-lg flex items-center gap-2">
                                            {expert.name}
                                            {expert.verified && <CheckCircle2 className="h-5 w-5 text-primary" />}
                                        </h2>
                                        <Badge variant="secondary" className="mt-1">
                                            {expert.expertise}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">About {expert.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                                            {expert.bio}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <span className="font-medium">{expert.rating}</span>
                                        <span className="text-muted-foreground">({expert.totalSessions} sessions)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Client Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {expert.reviews && expert.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {expert.reviews.map((review) => (
                                            <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-sm">{review.author}</span>
                                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                                </div>
                                                <div className="flex mb-2">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < Math.floor(review.rating)
                                                                    ? "fill-primary text-primary"
                                                                    : "text-muted-foreground"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="relative pl-4">
                                                    <Quote className="h-3 w-3 absolute left-0 top-0 text-muted-foreground/40" />
                                                    <p className="text-sm text-muted-foreground italic">{review.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
