import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Category, Tag } from '@/types/database'

interface FilterBarProps {
  categories: Category[]
  tags: Tag[]
  activeCategory?: string
  activeTag?: string
}

export function FilterBar({ categories, tags, activeCategory, activeTag }: FilterBarProps) {
  if (categories.length === 0 && tags.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/blog"
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                !activeCategory 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/blog?category=${category.slug}`}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  activeCategory === category.slug 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 10).map((tag) => (
              <Link 
                key={tag.id} 
                href={`/blog?tag=${tag.slug}`}
                className={cn(
                  "text-xs transition-colors hover:text-foreground",
                  activeTag === tag.slug 
                    ? "text-primary font-medium" 
                    : "text-muted-foreground"
                )}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
