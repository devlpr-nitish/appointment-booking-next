"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function ExpertFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const category = searchParams.get("category") || "all"
    const initialSearch = searchParams.get("search") || ""

    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const debouncedSearch = useDebounce(searchQuery, 2000);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        // Handle Category
        if (category && category !== "all") {
            params.set("category", category)
        } else {
            params.delete("category")
        }

        if (debouncedSearch) {
            params.set("search", debouncedSearch)
        } else {
            params.delete("search")
        }

        params.delete("page")

        router.push(`/experts?${params.toString()}`)
    }, [category, debouncedSearch, router])

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all") {
            params.set("category", value)
        } else {
            params.delete("category")
        }

        if (searchQuery) {
            params.set("search", searchQuery)
        }
        params.delete("page")
        router.push(`/experts?${params.toString()}`)
    }

    return (
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <Input
                    placeholder="Search by name or expertise..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
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
