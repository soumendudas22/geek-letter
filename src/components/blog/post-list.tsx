import dynamic from 'next/dynamic'
import { SkeletonCard } from '@/components/ui/skeleton-card'
import type { PostWithAll } from '@/types/database'

/**
 * Dynamically import PostCard client component for code splitting.
 * Uses SkeletonCard as the loading placeholder.
 */
const PostCard = dynamic(
  () => import('./post-card').then((mod) => mod.PostCard),
  { loading: () => <SkeletonCard /> }
)

interface PostListProps {
  posts: PostWithAll[]
}

/**
 * PostList — renders a grid of post cards with staggered fade-up animation.
 * First post is marked as featured for a larger card.
 */
export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-2xl bg-muted/30 border border-dashed">
        <p className="text-muted-foreground text-lg mb-1 font-medium">No articles found</p>
        <p className="text-muted-foreground/70 text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`animate-fade-up ${index === 0 ? 'sm:col-span-2 xl:col-span-2' : ''}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <PostCard
            post={post}
            featured={index === 0}
            index={index}
          />
        </div>
      ))}
    </div>
  )
}
