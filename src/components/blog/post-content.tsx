import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import type { PostWithAll } from '@/types/database'

/**
 * Dynamically import client components for code splitting.
 * Each shows an appropriately-sized skeleton while loading.
 */
const NewsletterForm = dynamic(
  () => import('./newsletter-form').then((mod) => mod.NewsletterForm),
  {
    loading: () => (
      <div className="max-w-xl mx-auto text-center space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 max-w-full mx-auto" />
        <div className="flex gap-3 max-w-md mx-auto pt-4">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    ),
  }
)

const ReadingProgress = dynamic(
  () => import('./reading-progress').then((mod) => mod.ReadingProgress)
)

const ShareButtons = dynamic(
  () => import('./share-buttons').then((mod) => mod.ShareButtons),
  {
    loading: () => <Skeleton className="h-8 w-20 rounded-md" />,
  }
)

const LikeButton = dynamic(
  () => import('./like-button').then((mod) => mod.LikeButton),
  {
    loading: () => <Skeleton className="h-8 w-16 rounded-full" />,
  }
)


interface PostContentProps {
  post: PostWithAll
  relatedPosts: PostWithAll[]
}

/**
 * PostContent — immersive blog post layout with:
 * - Reading progress bar at top
 * - Full-width cover image with gradient overlay
 * - Share buttons inline
 * - CTA newsletter section with gradient background
 * - Improved related posts design
 */
export function PostContent({ post, relatedPosts }: PostContentProps) {
  return (
    <article className="flex flex-col min-h-screen">
      {/* Reading progress indicator */}
      <ReadingProgress />

      {/* Post header */}
      <header className="border-b">
        <div className="container lg:max-w-[70%] py-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.category && (
                <Badge variant="secondary" className="font-medium rounded-full px-3">
                  {post.category.name}
                </Badge>
              )}
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance"
              style={{ fontFamily: 'var(--font-serif-var), serif' }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at || post.created_at)}
                </time>
                {post.reading_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.reading_time} min read
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <LikeButton postId={post.id} />
                <div className="h-4 w-px bg-border" />
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {post.cover_image && (
        <div className="relative w-full bg-muted/10 flex items-center justify-center overflow-hidden border-b">
          {/* Subtle blurred background for aesthetic fit */}
          <div className="absolute inset-0 opacity-20 blur-3xl scale-110 pointer-events-none">
            <Image
              src={post.cover_image}
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative w-full container lg:max-w-[70%] aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Article content */}
      <div className="container lg:max-w-[60%] py-12 md:py-16">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share after reading */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Enjoyed this article?</p>
            <LikeButton postId={post.id} />
          </div>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </div>

      {/* Geek Letter CTA */}
      <div className="relative border-t overflow-hidden">
        <div className="absolute inset-0 gradient-bg-hero opacity-40" />
        <div className="container lg:max-w-[60%] py-16 relative">
          <NewsletterForm />
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="container lg:max-w-[70%] py-12 md:py-16">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-serif-var), serif' }}
          >
            Continue Reading
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {relatedPosts.slice(0, 2).map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group block p-6 rounded-2xl border bg-card transition-all card-hover card-glow"
              >
                {relatedPost.cover_image && (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-muted">
                    <Image
                      src={relatedPost.cover_image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  {relatedPost.category && (
                    <Badge variant="secondary" className="text-xs rounded-full">
                      {relatedPost.category.name}
                    </Badge>
                  )}
                </div>
                <h3
                  className="font-bold group-hover:text-primary transition-colors line-clamp-2 mb-2 text-lg"
                  style={{ fontFamily: 'var(--font-serif-var), serif' }}
                >
                  {relatedPost.title}
                </h3>
                {relatedPost.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                  <span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                  {relatedPost.reading_time && (
                    <span>{relatedPost.reading_time} min read</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
