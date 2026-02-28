import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, verifyAdmin } from '@/lib/supabase/server-client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin()
  if (authError) return authError

  const { id } = await params
  const supabase = await createAdminClient()

  try {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id)

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
