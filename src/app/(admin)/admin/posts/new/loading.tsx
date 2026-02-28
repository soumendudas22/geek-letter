import { Skeleton } from '@/components/ui/skeleton'

/**
 * NewPostPageLoading — skeleton loading state for the new post form.
 *
 * Mirrors the layout of NewPostPage:
 * - Page heading
 * - Form fields: title, slug, category dropdown, content, excerpt, cover image,
 *   tags, SEO fields
 * - Submit button
 */
export default function NewPostPageLoading() {
    return (
        <div className="animate-page-enter">
            {/* Heading */}
            <Skeleton className="h-9 w-32 mb-8" />

            {/* Form skeleton */}
            <div className="space-y-6 max-w-4xl">
                {/* Title */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* Category + Tags row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-64 w-full rounded-md" />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-24 w-full rounded-md" />
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* SEO section */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-20 w-full rounded-md" />
                    </div>
                </div>

                {/* Submit button */}
                <Skeleton className="h-11 w-32 rounded-md" />
            </div>
        </div>
    )
}
