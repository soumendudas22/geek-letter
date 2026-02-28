'use client'

import { useEffect, useState } from 'react'

/**
 * ReadingProgress — sticky progress bar at the top of the viewport.
 * Tracks scroll position relative to article length and displays
 * a gradient bar that fills from left to right.
 */
export function ReadingProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        function handleScroll() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            if (scrollHeight <= 0) return
            const scrolled = Math.min(window.scrollY / scrollHeight, 1)
            setProgress(scrolled)
        }

        // Use passive listener for scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            className="reading-progress"
            style={{ transform: `scaleX(${progress})` }}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
        />
    )
}
