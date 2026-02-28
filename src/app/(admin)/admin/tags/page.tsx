import dynamic from 'next/dynamic'
import { createAdminClient } from '@/lib/supabase/server-client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Dynamically import TagsPageClient to code-split the heavy client bundle.
 * Shows an inline skeleton fallback while the JS chunk loads.
 */
const TagsPageClient = dynamic(
  () =>
    import('@/components/admin/tags-client').then((mod) => mod.TagsPageClient),
  {
    loading: () => (
      <div className="w-full animate-page-enter">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 md:h-9 w-20" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <div className="hidden md:block rounded-lg border">
          <div className="grid grid-cols-[1fr_1fr_100px] gap-4 p-4 border-b bg-muted/50">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-14" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_100px] gap-4 p-4 border-b last:border-b-0 items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-3 w-16" /></div>
                <div className="flex gap-1"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    ),
  }
)

export default async function AdminTagsPage() {
  const supabase = await createAdminClient()
  const { data: tags } = await supabase.from('tags').select('*').order('name')

  return <TagsPageClient initialTags={tags || []} />
}
