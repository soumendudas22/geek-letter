import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server-client'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Dynamically import PostForm to code-split the heavy editor bundle.
 * Shows an inline skeleton fallback while the JS chunk loads.
 */
const PostForm = dynamic(
  () => import('@/components/admin/post-form').then((mod) => mod.PostForm),
  {
    loading: () => (
      <div className="space-y-6 max-w-4xl animate-page-enter">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full rounded-md" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-10" /><Skeleton className="h-10 w-full rounded-md" /></div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="h-11 w-32 rounded-md" />
      </div>
    ),
  }
)

export default async function NewPostPage() {
  const supabase = await createAdminClient()

  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('tags').select('*').order('name'),
  ])

  async function handleSubmit(formData: FormData) {
    'use server'

    const supabase = await createAdminClient()

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const coverImage = formData.get('cover_image') as string
    const categoryId = formData.get('category_id') as string
    const metaTitle = formData.get('meta_title') as string
    const metaDescription = formData.get('meta_description') as string
    const tagsJson = formData.get('tags') as string

    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        content,
        excerpt: excerpt || null,
        cover_image: coverImage || null,
        category_id: categoryId || null,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        reading_time: readingTime,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (post && tagsJson) {
      const selectedTags = JSON.parse(tagsJson) as string[]
      if (selectedTags.length > 0) {
        const postTags = selectedTags.map((tagId) => ({
          post_id: (post as { id: string }).id,
          tag_id: tagId,
        }))
        await supabase.from('post_tags').insert(postTags)
      }
    }

    redirect('/admin/posts')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">New Post</h1>
      <PostForm
        categories={categories || []}
        tags={tags || []}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
