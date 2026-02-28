import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
}

/**
 * SkeletonCard — loading placeholder for PostCard.
 * Matches PostCard layout for seamless transitions.
 */
export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-card border h-full',
        className
      )}
    >
      {/* Image skeleton */}
      <div className="aspect-[16/10] skeleton" />

      {/* Content skeleton */}
      <div className="p-5 md:p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 skeleton w-full" />
          <div className="h-5 skeleton w-3/4" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 skeleton w-full" />
          <div className="h-4 skeleton w-5/6" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
          <div className="h-3 skeleton w-20" />
          <div className="h-3 skeleton w-16" />
        </div>
      </div>
    </div>
  )
}

/**
 * SkeletonPostGrid — loading grid for blog page.
 */
export function SkeletonPostGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/**
 * SkeletonText — inline text loading placeholder.
 */
export function SkeletonText({
  className,
  width = 'w-full',
}: {
  className?: string
  width?: string
}) {
  return <div className={cn('h-4 skeleton', width, className)} />
}
