import { Skeleton } from '@/components/ui/skeleton'

/**
 * BlogPostLoading — skeleton loading state for a single blog post page.
 *
 * Mirrors the layout of PostContent:
 * - Article header with category badge, title, meta info, cover image
 * - Article body (prose) skeleton
 * - Tags section
 * - Related posts section
 */
export default function BlogPostLoading() {
    return (
        <div className="flex flex-col">
            {/* Article header skeleton */}
            <section className="relative border-b overflow-hidden">
                <div className="absolute inset-0 gradient-bg-hero opacity-30" />
                <div className="container lg:max-w-[70%] relative py-14 md:py-20">
                    {/* Category badge */}
                    <Skeleton className="h-6 w-24 rounded-full mb-4" />

                    {/* Title */}
                    <div className="space-y-3 mb-6">
                        <Skeleton className="h-8 md:h-10 lg:h-12 w-full" />
                        <Skeleton className="h-8 md:h-10 lg:h-12 w-3/4" />
                    </div>

                    {/* Meta info: date, reading time, like button */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Article content skeleton */}
            <div className="container lg:max-w-[70%] py-8 md:py-12">
                <article className="max-w-3xl mx-auto space-y-6">
                    {/* Cover image */}
                    <Skeleton className="w-full aspect-[16/9] rounded-xl" />

                    {/* Prose body */}
                    <div className="space-y-4">
                        {/* Paragraph 1 */}
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-4/5" />
                        </div>

                        {/* Heading */}
                        <Skeleton className="h-7 w-64 mt-8" />

                        {/* Paragraph 2 */}
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/5" />
                        </div>

                        {/* Code block */}
                        <Skeleton className="h-40 w-full rounded-lg mt-6" />

                        {/* Paragraph 3 */}
                        <div className="space-y-2 mt-6">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                        </div>

                        {/* Another heading */}
                        <Skeleton className="h-7 w-48 mt-8" />

                        {/* Paragraph 4 */}
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-4/5" />
                        </div>
                    </div>

                    {/* Tags section */}
                    <div className="flex items-center gap-2 pt-6 border-t">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-7 w-20 rounded-full" />
                        ))}
                    </div>
                </article>

                {/* Related posts skeleton */}
                <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
                    <Skeleton className="h-7 w-36 mb-6" />
                    <div className="grid gap-6 sm:grid-cols-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border overflow-hidden bg-card">
                                <Skeleton className="aspect-[16/10] w-full" />
                                <div className="p-5 space-y-3">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
