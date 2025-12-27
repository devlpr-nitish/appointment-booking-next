"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ExpertFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const category = searchParams.get("category") || "all"

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all") {
            params.set("category", value)
        } else {
            params.delete("category")
        }
        // Reset page on filter change
        params.delete("page")
        router.push(`/experts?${params.toString()}`)
    }

    return (
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                {/* Placeholder for future text search implementation */}
                <Input placeholder="Search by name or expertise..." className="w-full" />
            </div>
            <Select value={category} onValueChange={handleCategoryChange}>
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
    )
}
