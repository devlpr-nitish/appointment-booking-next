"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function NegotiationSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* Header skeleton */}
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                </div>

                {/* Request summary skeleton */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <Skeleton className="h-12 w-28 rounded-lg" />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </CardContent>
                </Card>

                {/* Live indicator skeleton */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                </div>

                {/* Offer cards skeletons */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-5">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                        <Skeleton className="h-3.5 w-24" />
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                        <div className="flex gap-2 pt-1">
                                            <Skeleton className="h-8 flex-1 rounded-md" />
                                            <Skeleton className="h-8 flex-1 rounded-md" />
                                            <Skeleton className="h-8 flex-1 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ExpertRequestSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <div className="flex gap-3 pt-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Skeleton className="h-8 w-24 rounded-lg" />
                                <Skeleton className="h-8 w-20 rounded-md" />
                                <Skeleton className="h-8 w-16 rounded-md" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
