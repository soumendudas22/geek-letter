import Link from 'next/link'
import { Plus, Pencil, Eye, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { createAdminClient } from '@/lib/supabase/server-client'
import type { Post } from '@/types/database'
import { DeletePostButton } from './delete-button'

/**
 * AdminPostsPage — responsive table/card layout.
 *
 * Mobile (<md): Stacked card layout with title, category, status, date.
 * Desktop (md+): Standard horizontal table.
 */
export default async function AdminPostsPage() {
  const supabase = await createAdminClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(name)
    `)
    .order('created_at', { ascending: false })

  type PostWithCategoryName = Post & { category: { name: string } | null }
  const postsData = (posts as unknown as PostWithCategoryName[]) ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Posts</h1>
        <Link href="/admin/posts/new">
          <Button size="sm" className="md:h-10 md:px-4 md:text-sm">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">New Post</span>
          </Button>
        </Link>
      </div>

      {!postsData || postsData.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No posts yet. Create your first post!
        </div>
      ) : (
        <>
          {/* ── Mobile: Card layout ─────────────────────────── */}
          <div className="space-y-3 md:hidden">
            {postsData.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  {/* Title + status */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-w-0">
                      {post.title}
                    </h3>
                    {post.published_at ? (
                      <Badge className="bg-green-500/90 text-white shrink-0 text-xs">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="shrink-0 text-xs">Draft</Badge>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {post.category?.name && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        {post.category.name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.created_at)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/posts/${post.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                    </Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Desktop: Table layout ───────────────────────── */}
          <div className="hidden md:block rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsData.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.category?.name && (
                        <Badge variant="secondary">{post.category.name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.published_at ? (
                        <Badge className="bg-green-500">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(post.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
