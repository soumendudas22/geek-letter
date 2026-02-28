import Link from 'next/link'
import {
  FileText,
  Users,
  FolderOpen,
  Tags,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PenLine,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createAdminClient } from '@/lib/supabase/server-client'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/types/database'

type RecentPost = Pick<Post, 'id' | 'title' | 'slug' | 'published_at' | 'created_at'>

/**
 * AdminDashboard — polished dashboard with gradient welcome banner,
 * colored stat cards, quick actions, and recent activity.
 */
export default async function AdminDashboard() {
  const supabase = await createAdminClient()

  const [
    { count: postsCount },
    { count: subscribersCount },
    { count: categoriesCount },
    { count: tagsCount },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('tags').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('id, title, slug, published_at, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const cards = [
    {
      title: 'Total Posts',
      value: postsCount || 0,
      icon: FileText,
      href: '/admin/posts',
      color: 'from-blue-500/10 to-blue-600/5',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Subscribers',
      value: subscribersCount || 0,
      icon: Users,
      href: '/admin/subscribers',
      color: 'from-green-500/10 to-green-600/5',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Categories',
      value: categoriesCount || 0,
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'from-purple-500/10 to-purple-600/5',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Tags',
      value: tagsCount || 0,
      icon: Tags,
      href: '/admin/tags',
      color: 'from-orange-500/10 to-orange-600/5',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="w-full mx-auto">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative">
          <h1
            className="text-lg sm:text-xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-serif-var), serif' }}
          >
            Welcome back 👋
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Here's what's happening with your newsletter.
          </p>
        </div>
      </div>

      {/* Stat cards — 2 columns on all sizes, 4 on large desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="block">
            <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98]">
              <CardHeader className="flex flex-row items-center justify-between p-2.5 sm:p-3 md:p-4 pb-1 sm:pb-2 space-y-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  {card.title}
                </CardTitle>
                <div className={`p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg bg-gradient-to-br ${card.color} shrink-0`}>
                  <card.icon className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="p-2.5 sm:p-3 md:p-4 pt-0">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions + Recent activity — side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <PenLine className="h-4 w-4 text-primary shrink-0" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="flex flex-col gap-2">
              <Link href="/admin/posts/new">
                <Button className="rounded-xl shadow-sm w-full justify-start h-10 sm:h-11 text-xs sm:text-sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="rounded-xl w-full justify-start h-10 sm:h-11 text-xs sm:text-sm">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
              <Link href="/admin/tags">
                <Button variant="outline" className="rounded-xl w-full justify-start h-10 sm:h-11 text-xs sm:text-sm">
                  <Tags className="mr-2 h-4 w-4" />
                  Manage Tags
                </Button>
              </Link>
              <Link href="/blog" target="_blank">
                <Button variant="ghost" className="rounded-xl w-full justify-start h-10 sm:h-11 text-xs sm:text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Live Blog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <BarChart3 className="h-4 w-4 text-primary shrink-0" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            {recentPosts && recentPosts.length > 0 ? (
              <ul className="space-y-2 sm:space-y-3">
                {(recentPosts as unknown as RecentPost[]).map((post) => (
                  <li key={post.id} className="flex items-center gap-2 sm:gap-3 min-w-0 p-1.5 sm:p-2 -mx-1.5 sm:-mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.published_at ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{post.title}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                    <Link href={`/admin/posts/${post.id}/edit`} className="shrink-0">
                      <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 rounded-lg">
                        Edit
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground">No posts yet</p>
                <Link href="/admin/posts/new">
                  <Button variant="link" size="sm" className="mt-2 text-xs sm:text-sm">
                    Create your first post
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
