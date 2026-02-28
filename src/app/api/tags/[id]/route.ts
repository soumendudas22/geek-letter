import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, verifyAdmin } from '@/lib/supabase/server-client'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin()
  if (authError) return authError

  const { id } = await params
  const supabase = await createAdminClient()

  try {
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tags')
      .update({ name, slug })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin()
  if (authError) return authError

  const { id } = await params
  const supabase = await createAdminClient()

  try {
    await supabase.from('post_tags').delete().eq('tag_id', id)

    const { error } = await supabase.from('tags').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
