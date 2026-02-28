import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from('subscribers')
        .update({ is_active: true, unsubscribed_at: null })
        .eq('id', existing.id)

      if (error) {
        return NextResponse.json(
          { error: 'Failed to resubscribe' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'Resubscribed successfully' })
    }

    const { error } = await supabase.from('subscribers').insert({
      email,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
