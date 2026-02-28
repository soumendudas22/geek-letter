import dynamic from 'next/dynamic'
import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server-client'
import { Skeleton } from '@/components/ui/skeleton'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

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

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createAdminClient()

  const [{ data: post }, { data: categories }, { data: tags }, { data: postTags }] =
    await Promise.all([
      supabase.from('posts').select('*').eq('id', id).single(),
      supabase.from('categories').select('*').order('name'),
      supabase.from('tags').select('*').order('name'),
      supabase.from('post_tags').select('tag_id').eq('post_id', id),
    ])

  if (!post) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    'use server'

    const supabase = await createAdminClient()

    const postId = formData.get('id') as string
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

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        slug,
        content,
        excerpt: excerpt || null,
        cover_image: coverImage || null,
        category_id: categoryId || null,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)

    if (error) {
      throw new Error(error.message)
    }

    await supabase.from('post_tags').delete().eq('post_id', postId)

    if (tagsJson) {
      const selectedTags = JSON.parse(tagsJson) as string[]
      if (selectedTags.length > 0) {
        const postTagsData = selectedTags.map((tagId) => ({
          post_id: postId,
          tag_id: tagId,
        }))
        await supabase.from('post_tags').insert(postTagsData)
      }
    }

    redirect('/admin/posts')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt || '',
          cover_image: post.cover_image || '',
          category_id: post.category_id || '',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          selectedTags: postTags?.map((pt: { tag_id: string }) => pt.tag_id) || [],
        }}
        categories={categories || []}
        tags={tags || []}
        onSubmit={handleSubmit}
        isEditing
      />
    </div>
  )
}
