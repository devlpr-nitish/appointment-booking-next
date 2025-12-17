import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Expert } from "@/lib/data/experts"

interface ExpertCardProps {
  expert: Expert
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            <Image src={expert.imageUrl || "/placeholder.svg"} alt={expert.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{expert.name}</h3>
              {expert.verified && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
            </div>
            <Badge variant="secondary" className="text-xs">
              {expert.expertise}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{expert.bio}</p>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{expert.rating}</span>
            <span className="text-muted-foreground">({expert.totalSessions})</span>
          </div>
          <div className="text-muted-foreground">${expert.hourlyRate}/hr</div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/experts/${expert.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
