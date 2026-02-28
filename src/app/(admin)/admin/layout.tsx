import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Dynamically import AdminSidebar to code-split  the sidebar's client bundle
 * (theme toggle, sheet drawer, navigation state).
 */
const AdminSidebar = dynamic(
  () =>
    import('@/components/admin/admin-sidebar').then(
      (mod) => mod.AdminSidebar
    ),
  {
    loading: () => (
      <>
        {/* Desktop sidebar skeleton */}
        <aside className="hidden md:flex w-60 flex-col border-r bg-card/50 p-4 fixed inset-y-0 left-0 z-40">
          <div className="flex items-center gap-3 mb-8 px-2">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <nav className="space-y-1 flex-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </nav>
          <div className="border-t pt-4 mt-4 space-y-1">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </aside>

        {/* Mobile topbar skeleton */}
        <div className="md:hidden fixed top-0 left-0 right-0 w-full h-14 border-b bg-background/95 backdrop-blur-xl z-50 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-11 w-11 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-11 w-11 rounded-md" />
        </div>
      </>
    ),
  }
)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen md:ml-60 pt-16 md:pt-6 px-3 sm:px-4 pb-4 sm:pb-6">
        {children}
      </main>
    </div>
  )
}
