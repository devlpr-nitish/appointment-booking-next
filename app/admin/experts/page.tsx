import { requireRole } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { getAllExperts } from "@/lib/data/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default async function AdminExpertsPage() {
  const user = await requireRole("admin")
  const experts = await getAllExperts()

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Expert Management</h1>
          <p className="text-muted-foreground">View and verify expert accounts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Experts ({experts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experts.map((expert) => (
                <div key={expert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={expert.imageUrl || "/placeholder.svg"}
                        alt={expert.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{expert.name}</p>
                        {expert.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{expert.expertise}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-muted-foreground">${expert.hourlyRate}/hr</p>
                        <p className="text-xs text-muted-foreground">{expert.totalSessions} sessions</p>
                        <p className="text-xs text-muted-foreground">Rating: {expert.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expert.verified ? (
                      <Badge className="bg-primary">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Unverified</Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                    {!expert.verified && (
                      <Button size="sm" variant="default">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
