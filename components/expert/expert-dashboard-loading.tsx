import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCardSkeleton } from "@/components/user/stats-card-skeleton"

export function ExpertDashboardLoading() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-9 w-64" />
                </div>
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
            </div>

            {/* Profile Overview Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-28" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-16 mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-12 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
