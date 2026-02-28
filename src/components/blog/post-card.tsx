'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate, cn } from '@/lib/utils'
import { LikeButton } from './like-button'
import type { PostWithAll } from '@/types/database'

interface PostCardProps {
  post: PostWithAll
  className?: string
  featured?: boolean
  index?: number
}

/**
 * PostCard — high-engagement article card.
 *
 * Engagement hooks:
 * - Gradient overlay on image for text readability
 * - Image zoom on hover (scale-105) with rounded corners
 * - "New" badge for posts published within 7 days
 * - Animated arrow icon on hover (upward-right movement)
 * - Category pill for scannability
 * - Reading time creates commitment
 * - Hover glow effect (card-glow class)
 */
export function PostCard({ post, className, featured = false }: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const isNew = post.published_at
    ? (Date.now() - new Date(post.published_at).getTime()) < 7 * 24 * 60 * 60 * 1000
    : false

  return (
    <article className={cn('group relative h-full', className)}>
      <Link href={`/blog/${post.slug}`} className="block h-full no-tap-highlight">
        <div className={cn(
          "relative overflow-hidden rounded-2xl bg-card border transition-all duration-300 card-hover card-glow h-full",
          "active:scale-[0.98] md:active:scale-100",
          featured ? "md:grid md:grid-cols-2" : "flex flex-col"
        )}>
          {/* Cover image with overlay */}
          {post.cover_image ? (
            <div className={cn(
              "relative overflow-hidden bg-muted/10",
              featured ? "aspect-[16/10] md:aspect-auto" : "aspect-[16/10]"
            )}>
              {/* Blur placeholder skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton" />
              )}

              {/* Subtle blurred background for aesthetic fit */}
              <div className="absolute inset-0 opacity-20 blur-xl scale-110 pointer-events-none">
                <Image
                  src={post.cover_image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className={cn(
                  "object-contain transition-all duration-700 group-hover:scale-[1.02]",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {isNew && (
                  <Badge className="bg-accent text-accent-foreground text-xs font-semibold shadow-lg px-2.5 py-0.5">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
                {post.category && (
                  <Badge variant="secondary" className="text-xs font-medium backdrop-blur-md bg-background/70 shadow-sm px-2.5 py-0.5">
                    {post.category.name}
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className={cn(
              "relative bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 flex items-center justify-center",
              featured ? "aspect-[16/10] md:aspect-auto" : "aspect-[16/10]"
            )}>
              <span className="text-5xl opacity-20"
                style={{ fontFamily: 'var(--font-serif-var), serif' }}>
                {post.title.charAt(0)}
              </span>

              <div className="absolute top-4 left-4 flex gap-2">
                {isNew && (
                  <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
                {post.category && (
                  <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                    {post.category.name}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className={cn(
            "flex flex-col p-5 md:p-6",
            featured ? "md:justify-center md:py-8" : "flex-1"
          )}>
            <h2 className={cn(
              "font-bold tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug",
              featured ? "text-xl md:text-2xl" : "text-lg"
            )}
              style={{ fontFamily: 'var(--font-serif-var), serif' }}>
              {post.title}
            </h2>

            {post.excerpt && (
              <p className={cn(
                "text-muted-foreground text-sm leading-relaxed mb-4",
                featured ? "line-clamp-3" : "line-clamp-2"
              )}>
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <time className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.published_at || post.created_at)}
                </time>
                {post.reading_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.reading_time} min
                  </span>
                )}
                <div className="h-3 w-px bg-border/50" />
                <LikeButton postId={post.id} compact />
              </div>

              <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                Read
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs text-muted-foreground/70 hover:text-primary transition-colors"
                  >
                    #{tag.name}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground/50">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
