import { notFound } from 'next/navigation'
import { PostContent } from '@/components/blog'
import { createAdminClient } from '@/lib/supabase/server-client'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate static params for all published posts.
 * This enables static site generation (SSG) for better performance.
 */
export async function generateStaticParams() {
  const supabase = await createAdminClient()
  
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .not('published_at', 'is', null)
  
  return (posts || []).map((post) => ({
    slug: post.slug,
  }))
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createAdminClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('title, meta_title, meta_description, excerpt')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single()

  if (!post) return { title: 'Post not found' }

  const postData = post as { title: string; meta_title: string | null; meta_description: string | null; excerpt: string | null }

  return {
    title: postData.meta_title || postData.title,
    description: postData.meta_description || postData.excerpt,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single()

  if (!post) {
    notFound()
  }

  const postData = post as any
  const formattedPost = {
    ...postData,
    tags: postData.tags?.map((t: { tag: { id: string; name: string; slug: string; created_at: string } }) => t.tag) || []
  }

  const { data: relatedPosts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
    .eq('category_id', postData.category_id)
    .neq('id', postData.id)
    .not('published_at', 'is', null)
    .limit(2)

  const formattedRelatedPosts = (relatedPosts as any[])?.map(p => ({
    ...p,
    tags: p.tags?.map((t: { tag: { id: string; name: string; slug: string; created_at: string } }) => t.tag) || []
  })) || []

  return <PostContent post={formattedPost} relatedPosts={formattedRelatedPosts} />
}
