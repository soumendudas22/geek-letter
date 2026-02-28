import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

/** Regular client — uses publishable key, respects RLS, for user-facing auth operations. */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Route Handlers cannot set cookies on read-only request objects; error is expected in that context.
          }
        },
      },
    }
  )
}

/** Service client — uses secret key, bypasses RLS, for admin/server operations. */
export async function createServiceClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Route Handlers cannot set cookies on read-only request objects; error is expected in that context.
          }
        },
      },
    }
  )
}

/**
 * Named alias for createServiceClient so existing route handlers don't require renaming.
 * Prefer createServiceClient in new code.
 */
export const createAdminClient = createServiceClient

/**
 * Verifies the request is from an authenticated user.
 * This project uses a single-admin model — only one Supabase auth account
 * is created (the newsletter owner), so any authenticated user is the admin.
 * Returns a 401 NextResponse if unauthenticated, otherwise returns null.
 *
 * Usage in route handlers:
 *   const authError = await verifyAdmin()
 *   if (authError) return authError
 */
export async function verifyAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
