import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Shield, Video, Zap } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Experts",
    description: "All experts are thoroughly vetted and verified for their expertise and credentials",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions at times that work for you with easy calendar integration",
  },
  {
    icon: Video,
    title: "Video Sessions",
    description: "High-quality video calls with screen sharing and recording options",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Get confirmed within minutes and start learning from experts right away",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Why Choose Our Platform</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a seamless expert consultation experience
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
