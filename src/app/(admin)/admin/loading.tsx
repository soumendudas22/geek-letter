import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/**
 * AdminDashboardLoading — skeleton loading state for the admin dashboard.
 *
 * Mirrors the layout of AdminDashboard:
 * - Welcome banner skeleton
 * - 4 stat card skeletons in a 2x2 / 4-column grid
 * - Quick Actions + Recent Activity side-by-side cards
 */
export default function AdminDashboardLoading() {
    return (
        <div className="w-full mx-auto animate-page-enter">
            {/* Welcome banner skeleton */}
            <div className="relative overflow-hidden rounded-xl border p-4 sm:p-5 mb-4 sm:mb-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Stat cards skeleton — 2 cols mobile, 4 cols desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between p-2.5 sm:p-3 md:p-4 pb-1 sm:pb-2 space-y-0">
                            <Skeleton className="h-3 w-16 sm:w-20" />
                            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-md sm:rounded-lg" />
                        </CardHeader>
                        <CardContent className="p-2.5 sm:p-3 md:p-4 pt-0">
                            <Skeleton className="h-7 sm:h-8 md:h-9 w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions + Recent Activity skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Quick Actions skeleton */}
                <Card>
                    <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 sm:h-11 w-full rounded-xl" />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity skeleton */}
                <Card>
                    <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                        <div className="space-y-2 sm:space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg"
                                >
                                    <Skeleton className="w-2 h-2 rounded-full shrink-0" />
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-7 sm:h-8 w-12 rounded-lg shrink-0" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
