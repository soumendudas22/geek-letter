import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Mail as MailIcon, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewsletterForm, PostCard } from '@/components/blog'
import { GradientOrbs, SubscriberCount } from '@/components/blog/animated-hero'
import { createAdminClient } from '@/lib/supabase/server-client'
import type { PostWithJoins } from '@/types/database'

export default async function HomePage() {
  const supabase = await createAdminClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(3)

  const formattedPosts = (posts as unknown as PostWithJoins[])?.map(post => ({
    ...post,
    tags: post.tags?.map((t) => t.tag) ?? []
  })) ?? []

  return (
    <div className="flex flex-col">
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative overflow-hidden gradient-bg gradient-bg-hero">
        <GradientOrbs />
        <div className="container relative py-16 sm:py-24 md:py-32 lg:py-40 hero-mobile-optimized flex items-center">
          <div className="flex flex-col items-center text-center container lg:max-w-[70%] mx-auto">
            {/* Social proof badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary mb-6 sm:mb-8">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <SubscriberCount />
            </div>

            {/* Headline with serif font */}
            <h1 className="animate-fade-up animation-delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance mb-4 sm:mb-6 px-2"
              style={{ fontFamily: 'var(--font-serif-var), serif' }}>
              Ideas worth{' '}
              <span className="gradient-text">sharing</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-up animation-delay-200 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 sm:mb-10 text-balance leading-relaxed px-4">
              Curated insights on technology, design, and building meaningful products.
              Subscribe once — never miss an insight again.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up animation-delay-300 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link href="/blog" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Explore Articles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#subscribe" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 text-base rounded-full border-2 hover:bg-primary/5 transition-all">
                  Subscribe Free
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════ LATEST ARTICLES ═══════ */}
      <section className="container py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="animate-fade-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2"
              style={{ fontFamily: 'var(--font-serif-var), serif' }}>
              Latest Articles
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">Fresh insights from my desk — no fluff, just value</p>
          </div>
          <Link href="/blog">
            <Button variant="ghost" className="group text-sm sm:text-base -ml-4 sm:ml-0">
              View all articles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {formattedPosts.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {formattedPosts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-2xl bg-muted/30 border border-dashed">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
              <BookOpen className="h-7 w-7" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">Articles coming soon...</p>
            <p className="text-muted-foreground/70 text-sm mt-1">Subscribe to be the first to know</p>
          </div>
        )}
      </section>

      {/* ═══════ SUBSCRIBE SECTION ═══════ */}
      <section id="subscribe" className="relative border-y overflow-hidden">
        <div className="absolute inset-0 gradient-bg-hero opacity-50" />
        <div className="container relative py-20 md:py-28">
          <NewsletterForm />
        </div>
      </section>

      {/* ═══════ VALUE PROPOSITIONS ═══════ */}
      <section className="container py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-10 stagger-children">
          {[
            {
              icon: BookOpen,
              title: 'Thoughtful Writing',
              description: 'In-depth articles crafted with care. Quality over quantity, always. No clickbait, no filler — just real value.',
              color: 'from-primary/20 to-primary/5',
            },
            {
              icon: MailIcon,
              title: 'Direct to Inbox',
              description: 'Subscribe once and get every new article delivered straight to your email. Zero spam, ever. Unsubscribe anytime.',
              color: 'from-accent/20 to-accent/5',
            },
            {
              icon: Zap,
              title: 'Actionable Insights',
              description: 'Practical knowledge from real experience. Battle-tested ideas you can actually apply to your work today.',
              color: 'from-chart-5/20 to-chart-5/5',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative p-5 sm:p-6 md:p-8 rounded-2xl glass-card card-hover card-glow text-center sm:text-left"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} text-primary mb-4 sm:mb-5 transition-transform group-hover:scale-110`}>
                <item.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2"
                style={{ fontFamily: 'var(--font-serif-var), serif' }}>
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
