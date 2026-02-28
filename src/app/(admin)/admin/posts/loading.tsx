import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * PostsPageLoading — skeleton loading state for the posts list page.
 *
 * Mirrors the layout of AdminPostsPage:
 * - Header row with title + "New Post" button skeleton
 * - Mobile: stacked card skeletons
 * - Desktop: table skeleton with header + rows
 */
export default function PostsPageLoading() {
    return (
        <div className="animate-page-enter">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <Skeleton className="h-8 md:h-9 w-24" />
                <Skeleton className="h-9 md:h-10 w-10 md:w-28 rounded-md" />
            </div>

            {/* Mobile: Card layout skeleton */}
            <div className="space-y-3 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                            {/* Title + status */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                            </div>
                            {/* Meta row */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                <Skeleton className="h-8 flex-1 rounded-md" />
                                <Skeleton className="h-8 flex-1 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop: Table layout skeleton */}
            <div className="hidden md:block rounded-lg border">
                {/* Table header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 p-4 border-b bg-muted/50">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-4 w-14" />
                </div>
                {/* Table rows */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 p-4 border-b last:border-b-0 items-center"
                    >
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
