import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * SubscribersPageLoading — skeleton loading state for the subscribers page.
 *
 * Mirrors the layout of SubscribersPageClient:
 * - Header row with title + count
 * - Mobile: stacked card skeletons with email, date, status
 * - Desktop: table skeleton with Email, Status, Subscribed At, Actions columns
 */
export default function SubscribersPageLoading() {
    return (
        <div className="w-full animate-page-enter">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 mb-6">
                <Skeleton className="h-8 md:h-9 w-36" />
                <Skeleton className="h-4 w-16" />
            </div>

            {/* Mobile: Card layout skeleton */}
            <div className="space-y-3 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop: Table layout skeleton */}
            <div className="hidden md:block rounded-lg border">
                {/* Table header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_100px] gap-4 p-4 border-b bg-muted/50">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-14" />
                </div>
                {/* Table rows */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[2fr_1fr_1fr_100px] gap-4 p-4 border-b last:border-b-0 items-center"
                    >
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    )
}
