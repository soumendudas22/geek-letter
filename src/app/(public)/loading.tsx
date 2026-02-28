import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonCard } from '@/components/ui/skeleton-card'

/**
 * HomePageLoading — skeleton loading state for the public homepage.
 *
 * Mirrors the layout of HomePage:
 * - Hero section with badge, headline, subheadline, CTA buttons
 * - Latest Articles section with 3 post card skeletons
 * - Subscribe section skeleton
 * - Value propositions (3 feature cards)
 */
export default function HomePageLoading() {
    return (
        <div className="flex flex-col">
            {/* ═══════ HERO SECTION SKELETON ═══════ */}
            <section className="relative overflow-hidden gradient-bg gradient-bg-hero">
                <div className="container relative py-16 sm:py-24 md:py-32 lg:py-40 flex items-center">
                    <div className="flex flex-col items-center text-center container lg:max-w-[70%] mx-auto">
                        {/* Social proof badge */}
                        <Skeleton className="h-8 w-48 rounded-full mb-6 sm:mb-8" />

                        {/* Headline */}
                        <Skeleton className="h-10 sm:h-12 md:h-14 lg:h-16 w-3/4 mb-4 sm:mb-6 rounded-lg" />

                        {/* Subheadline */}
                        <div className="space-y-2 max-w-2xl mb-8 sm:mb-10 w-full">
                            <Skeleton className="h-5 w-full mx-auto" />
                            <Skeleton className="h-5 w-2/3 mx-auto" />
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                            <Skeleton className="h-12 sm:h-13 w-full sm:w-44 rounded-full" />
                            <Skeleton className="h-12 sm:h-13 w-full sm:w-44 rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* ═══════ LATEST ARTICLES SKELETON ═══════ */}
            <section className="container py-16 sm:py-20 md:py-28 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
                    <div className="space-y-2">
                        <Skeleton className="h-8 sm:h-10 w-48" />
                        <Skeleton className="h-5 w-72" />
                    </div>
                    <Skeleton className="h-9 w-36 rounded-md" />
                </div>

                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </section>

            {/* ═══════ SUBSCRIBE SECTION SKELETON ═══════ */}
            <section className="relative border-y overflow-hidden">
                <div className="absolute inset-0 gradient-bg-hero opacity-50" />
                <div className="container relative py-20 md:py-28">
                    <div className="max-w-xl mx-auto text-center space-y-4">
                        <Skeleton className="h-8 w-64 mx-auto" />
                        <Skeleton className="h-5 w-96 max-w-full mx-auto" />
                        <div className="flex gap-3 max-w-md mx-auto pt-4">
                            <Skeleton className="h-12 flex-1 rounded-full" />
                            <Skeleton className="h-12 w-32 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ VALUE PROPOSITIONS SKELETON ═══════ */}
            <section className="container py-16 sm:py-20 md:py-28 px-4 sm:px-6">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-5 sm:p-6 md:p-8 rounded-2xl glass-card text-center sm:text-left">
                            <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 mx-auto sm:mx-0" />
                            <Skeleton className="h-5 w-36 mb-2 mx-auto sm:mx-0" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
