import { getExpertById } from "@/lib/data/experts"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Star, Calendar, DollarSign } from "lucide-react"
import Image from "next/image"
import { BookingButton } from "@/components/booking/booking-button"

interface ExpertProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ExpertProfilePage({ params }: ExpertProfilePageProps) {
  const { id } = await params
  const expert = await getExpertById(id)

  if (!expert) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Expert Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-muted mx-auto md:mx-0">
                  <Image src={expert.imageUrl || "/placeholder.svg"} alt={expert.name} fill className="object-cover" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{expert.name}</h1>
                    {expert.verified && <CheckCircle2 className="h-6 w-6 text-primary" />}
                  </div>

                  <Badge variant="secondary" className="mb-4">
                    {expert.expertise}
                  </Badge>

                  <p className="text-muted-foreground leading-relaxed mb-6">{expert.bio}</p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-medium">{expert.rating}</span>
                      <span className="text-muted-foreground">({expert.totalSessions} sessions)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">${expert.hourlyRate}/hour</span>
                    </div>
                  </div>

                  <BookingButton expert={expert} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">{expert.bio}</p>
            </CardContent>
          </Card>

          {/* What to Expect */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">What to Expect</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Flexible Scheduling</p>
                    <p className="text-sm text-muted-foreground">Book sessions at times that work best for you</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Expert Guidance</p>
                    <p className="text-sm text-muted-foreground">
                      Get personalized advice from a verified professional
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Video Sessions</p>
                    <p className="text-sm text-muted-foreground">
                      High-quality video calls with screen sharing capabilities
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
