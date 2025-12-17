import { SiteHeader } from "@/components/layout/site-header"
import { getExperts } from "@/lib/data/experts"
import { ExpertCard } from "@/components/landing/expert-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function ExpertsPage() {
  const experts = await getExperts()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Expert</h1>
          <p className="text-muted-foreground">Browse our community of verified professionals</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input placeholder="Search by name or expertise..." className="w-full" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="business">Business Strategy</SelectItem>
              <SelectItem value="tech">Software Engineering</SelectItem>
              <SelectItem value="marketing">Marketing & Growth</SelectItem>
              <SelectItem value="design">Product Design</SelectItem>
              <SelectItem value="career">Career Coaching</SelectItem>
              <SelectItem value="finance">Finance & Investing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </main>
    </div>
  )
}
