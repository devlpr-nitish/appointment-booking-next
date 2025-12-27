import { SiteHeader } from "@/components/layout/site-header"
import { getExpertsPaginated } from "@/lib/data/experts"
import { ExpertCard } from "@/components/landing/expert-card"
import { ExpertFilters } from "@/components/expert/expert-filters"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ExpertsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined
  const limit = 9 // 3x3 grid

  const { experts, meta } = await getExpertsPaginated(page, limit, category)

  console.log("experts", experts);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Expert</h1>
          <p className="text-muted-foreground">Browse our community of verified professionals</p>
        </div>

        {/* Filters */}
        <ExpertFilters />

        {/* Results */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>

        {/* Pagination */}
        {meta.total_pages > 1 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" disabled={page <= 1} asChild={page > 1}>
              {page > 1 ? (
                <Link href={`/experts?page=${page - 1}`}>Previous</Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            <div className="flex items-center px-4">
              Page {page} of {meta.total_pages}
            </div>
            <Button variant="outline" disabled={page >= meta.total_pages} asChild={page < meta.total_pages}>
              {page < meta.total_pages ? (
                <Link href={`/experts?page=${page + 1}`}>Next</Link>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
