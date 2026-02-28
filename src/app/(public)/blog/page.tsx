import { PostList, SearchBar, FilterBar, NewsletterForm } from '@/components/blog'
import { createAdminClient } from '@/lib/supabase/server-client'
import type { Post, Category, Tag } from '@/types/database'

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
    tag?: string
    search?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const supabase = await createAdminClient()

  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('tags').select('*').order('name'),
  ])

  let query = supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  if (params.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    if (categoryData) {
      query = query.eq('category_id', (categoryData as { id: string }).id)
    }
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%`)
  }

  const { data: posts } = await query

  type PostWithJoins = Post & { category: Category | null; tags: Array<{ tag: Tag }> }
  let filteredPosts = (posts as unknown as PostWithJoins[])?.map(post => ({
    ...post,
    tags: post.tags?.map((t) => t.tag) ?? []
  })) ?? []

  if (params.tag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some((tag) => tag.slug === params.tag)
    )
  }

  async function handleSearch(query: string) {
    'use server'
    const searchParams = new URLSearchParams()
    if (query) searchParams.set('search', query)
    if (params.category) searchParams.set('category', params.category)
    if (params.tag) searchParams.set('tag', params.tag)
    return `/blog?${searchParams.toString()}`
  }

  const activeCategoryName = categories?.find(c => c.slug === params.category)?.name
  const activeTagName = tags?.find(t => t.slug === params.tag)?.name

  return (
    <div className="flex flex-col">
      {/* Blog header with gradient */}
      <section className="relative border-b overflow-hidden">
        <div className="absolute inset-0 gradient-bg-hero opacity-30" />
        <div className="container lg:max-w-[70%] relative py-14 md:py-20">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-3 animate-fade-up"
            style={{ fontFamily: 'var(--font-serif-var), serif' }}
          >
            Blog
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl animate-fade-up animation-delay-100">
            Thoughts, tutorials, and insights on technology and building products.
          </p>
        </div>
      </section>

      <div className="container lg:max-w-[70%] py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} placeholder="Search articles..." initialQuery={params.search} />
            </div>

            {(params.category || params.tag || params.search) && (
              <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b">
                <span className="text-sm text-muted-foreground">Filtering by:</span>
                {activeCategoryName && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {activeCategoryName}
                  </span>
                )}
                {activeTagName && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    #{activeTagName}
                  </span>
                )}
                {params.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
                    &quot;{params.search}&quot;
                  </span>
                )}
                <a
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Clear all
                </a>
              </div>
            )}

            <PostList posts={filteredPosts} />
          </div>

          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              <FilterBar
                categories={categories || []}
                tags={tags || []}
                activeCategory={params.category}
                activeTag={params.tag}
              />

              {/* Sidebar subscribe CTA */}
              <div className="p-6 rounded-2xl glass-card">
                <h3
                  className="font-bold mb-2"
                  style={{ fontFamily: 'var(--font-serif-var), serif' }}
                >
                  Never miss a post
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get new articles delivered straight to your inbox.
                </p>
                <NewsletterForm variant="compact" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
