import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server-client'

/**
 * GET /api/posts/[id]/like?fingerprint=xxx
 *
 * Returns the total like count for a post and whether
 * the given fingerprint has already liked it.
 *
 * @query fingerprint - Unique browser identifier from localStorage
 * @returns {{ count: number, liked: boolean }}
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const fingerprint = request.nextUrl.searchParams.get('fingerprint') || ''
    const supabase = await createAdminClient()

    try {
        // Fetch total like count for this post
        const { count, error: countError } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', id)

        if (countError) {
            return NextResponse.json(
                { error: countError.message },
                { status: 500 }
            )
        }

        // Check if this fingerprint already liked
        let liked = false
        if (fingerprint) {
            const { data: existingLike } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', id)
                .eq('fingerprint', fingerprint)
                .maybeSingle()

            liked = existingLike !== null
        }

        return NextResponse.json({ count: count ?? 0, liked })
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/posts/[id]/like
 *
 * Toggles a like for a post. If the fingerprint has already
 * liked the post, the like is removed (unlike). Otherwise,
 * a new like is created.
 *
 * @body {{ fingerprint: string }}
 * @returns {{ count: number, liked: boolean }}
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createAdminClient()

    try {
        const body = await request.json()
        const { fingerprint } = body

        if (!fingerprint || typeof fingerprint !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid fingerprint' },
                { status: 400 }
            )
        }

        // Check if this fingerprint already liked this post
        const { data: existingLike } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', id)
            .eq('fingerprint', fingerprint)
            .maybeSingle()

        let liked: boolean

        if (existingLike) {
            // Unlike: remove the existing like
            const { error: deleteError } = await supabase
                .from('post_likes')
                .delete()
                .eq('id', existingLike.id)

            if (deleteError) {
                return NextResponse.json(
                    { error: deleteError.message },
                    { status: 500 }
                )
            }
            liked = false
        } else {
            // Like: insert a new like
            const { error: insertError } = await supabase
                .from('post_likes')
                .insert({ post_id: id, fingerprint })

            if (insertError) {
                return NextResponse.json(
                    { error: insertError.message },
                    { status: 500 }
                )
            }
            liked = true
        }

        // Fetch updated count
        const { count } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', id)

        return NextResponse.json({ count: count ?? 0, liked })
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
