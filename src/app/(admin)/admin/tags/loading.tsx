import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * TagsPageLoading — skeleton loading state for the tags page.
 *
 * Mirrors the layout of TagsPageClient:
 * - Header row with title + "New Tag" button skeleton
 * - Mobile: stacked card skeletons with badge + slug
 * - Desktop: table skeleton with Name, Slug, Actions columns
 */
export default function TagsPageLoading() {
    return (
        <div className="w-full animate-page-enter">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 md:h-9 w-20" />
                <Skeleton className="h-9 w-28 rounded-md" />
            </div>

            {/* Mobile: Card layout skeleton */}
            <div className="space-y-3 md:hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop: Table layout skeleton */}
            <div className="hidden md:block rounded-lg border">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_100px] gap-4 p-4 border-b bg-muted/50">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-14" />
                </div>
                {/* Table rows */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[1fr_1fr_100px] gap-4 p-4 border-b last:border-b-0 items-center"
                    >
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
