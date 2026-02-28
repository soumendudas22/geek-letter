import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonCard } from '@/components/ui/skeleton-card'

/**
 * BlogPageLoading — skeleton loading state for the blog listing page.
 *
 * Mirrors the layout of BlogPage:
 * - Blog header with gradient background, title, description
 * - Search bar skeleton
 * - Post grid (6 skeleton cards)
 * - Sidebar with filter bar + subscribe CTA
 */
export default function BlogPageLoading() {
    return (
        <div className="flex flex-col">
            {/* Blog header skeleton */}
            <section className="relative border-b overflow-hidden">
                <div className="absolute inset-0 gradient-bg-hero opacity-30" />
                <div className="container lg:max-w-[70%] relative py-14 md:py-20">
                    <Skeleton className="h-10 md:h-12 w-28 mb-3" />
                    <Skeleton className="h-5 w-96 max-w-full" />
                </div>
            </section>

            <div className="container lg:max-w-[70%] py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {/* Search bar skeleton */}
                        <div className="mb-8">
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>

                        {/* Post grid skeleton */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar skeleton */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            {/* Filter bar skeleton */}
                            <div className="space-y-4">
                                {/* Categories filter */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <Skeleton key={i} className="h-7 w-20 rounded-full" />
                                        ))}
                                    </div>
                                </div>

                                {/* Tags filter */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-16" />
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <Skeleton key={i} className="h-7 w-16 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar subscribe CTA skeleton */}
                            <div className="p-6 rounded-2xl glass-card space-y-3">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-10 w-full rounded-md mt-2" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
