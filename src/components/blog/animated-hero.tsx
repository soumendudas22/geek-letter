'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * AnimatedCounter — counts up from 0 to a target number with easing.
 * Creates a "social proof" effect that feels dynamic and engaging.
 */
export function AnimatedCounter({ target, suffix = '+' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        if (hasAnimated.current || target <= 0) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true
                    animateCount()
                    observer.disconnect()
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()

        function animateCount() {
            const duration = 1500
            const startTime = performance.now()

            function tick(currentTime: number) {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Ease-out cubic for a satisfying deceleration
                const eased = 1 - Math.pow(1 - progress, 3)
                setCount(Math.floor(eased * target))

                if (progress < 1) {
                    requestAnimationFrame(tick)
                }
            }

            requestAnimationFrame(tick)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target])

    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    )
}

/**
 * GradientOrbs — decorative floating gradient blobs for visual depth.
 * Uses CSS animations for performance (GPU-accelerated transforms).
 */
export function GradientOrbs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Primary indigo orb — top-left */}
            <div
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 animate-float blur-3xl"
                style={{ background: 'oklch(0.42 0.18 270 / 0.5)' }}
            />
            {/* Coral accent orb — top-right */}
            <div
                className="absolute -top-10 right-10 w-56 h-56 rounded-full opacity-15 animate-float animation-delay-200 blur-3xl"
                style={{ background: 'oklch(0.68 0.19 25 / 0.5)' }}
            />
            {/* Purple orb — bottom-center */}
            <div
                className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full opacity-10 animate-float animation-delay-400 blur-3xl"
                style={{ background: 'oklch(0.55 0.20 310 / 0.5)' }}
            />
        </div>
    )
}

/**
 * SubscriberCount — fetches and displays subscriber count with social proof framing.
 * Shows a loading skeleton while fetching.
 */
export function SubscriberCount() {
    const [count, setCount] = useState<number | null>(null)

    useEffect(() => {
        async function fetchCount() {
            try {
                const res = await fetch('/api/subscribers/count')
                const data = await res.json()
                setCount(data.count ?? 0)
            } catch {
                setCount(0)
            }
        }
        fetchCount()
    }, [])

    if (count === null) {
        return (
            <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
        )
    }

    if (count === 0) {
        return (
            <span className="text-sm text-muted-foreground">
                Be the first to join
            </span>
        )
    }

    return (
        <span className="text-sm font-medium text-muted-foreground">
            Join{' '}
            <span className="font-bold text-primary">
                <AnimatedCounter target={count} />
            </span>{' '}
            curious readers
        </span>
    )
}
