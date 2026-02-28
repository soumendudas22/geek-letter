import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/subscribers/count
 *
 * Public endpoint that returns the active subscriber count.
 * Used for social proof on the homepage and newsletter forms.
 * Rounds down to nearest 10 for privacy ("1,230+" instead of exact count).
 */
export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SECRET_KEY!
        )

        const { count, error } = await supabase
            .from('subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)

        if (error) {
            return NextResponse.json({ count: 0 }, { status: 200 })
        }

        // Round down to nearest 10 for privacy, minimum display of 0
        const displayCount = Math.max(0, Math.floor((count ?? 0) / 10) * 10)

        return NextResponse.json(
            { count: displayCount },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            }
        )
    } catch {
        return NextResponse.json({ count: 0 }, { status: 200 })
    }
}
