'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Fingerprint key used in localStorage to uniquely identify
 * this browser for anonymous like tracking.
 */
const FINGERPRINT_KEY = 'newsletter-fingerprint'

/**
 * Generates or retrieves the browser's unique fingerprint
 * from localStorage. Returns empty string during SSR.
 */
function getFingerprint(): string {
    if (typeof window === 'undefined') return ''

    let fp = localStorage.getItem(FINGERPRINT_KEY)
    if (!fp) {
        fp = crypto.randomUUID()
        localStorage.setItem(FINGERPRINT_KEY, fp)
    }
    return fp
}

interface LikeButtonProps {
    /** UUID of the post to like/unlike */
    postId: string
    /** Compact mode for post cards (smaller, inline) */
    compact?: boolean
}

/**
 * LikeButton — animated heart toggle for anonymous post likes.
 *
 * Features:
 * - Optimistic UI: count updates instantly, reverts on API error
 * - Debounced API calls to prevent rapid-fire toggling
 * - Persistent liked state via localStorage fingerprint
 * - Scale + color animation on interaction
 */
export function LikeButton({ postId, compact = false }: LikeButtonProps) {
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Fetch initial like state on mount
    useEffect(() => {
        const fp = getFingerprint()
        if (!fp) return

        fetch(`/api/posts/${postId}/like?fingerprint=${encodeURIComponent(fp)}`)
            .then((res) => res.json())
            .then((data: { count: number; liked: boolean }) => {
                setCount(data.count)
                setLiked(data.liked)
            })
            .catch(() => {
                // Silently fail — show 0 likes, unliked state
            })
            .finally(() => setIsLoading(false))
    }, [postId])

    /**
     * Handles like/unlike toggle with optimistic update
     * and debounced API call.
     */
    const handleToggle = useCallback(() => {
        const fp = getFingerprint()
        if (!fp) return

        // Optimistic update
        const previousLiked = liked
        const previousCount = count
        const newLiked = !liked

        setLiked(newLiked)
        setCount((prev) => prev + (newLiked ? 1 : -1))

        // Trigger animation
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 400)

        // Debounce the API call (300ms)
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/posts/${postId}/like`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fingerprint: fp }),
                })

                if (!res.ok) throw new Error('Failed to toggle like')

                const data: { count: number; liked: boolean } = await res.json()
                // Sync with server truth
                setCount(data.count)
                setLiked(data.liked)
            } catch {
                // Revert optimistic update on failure
                setLiked(previousLiked)
                setCount(previousCount)
            }
        }, 300)
    }, [liked, count, postId])

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    if (compact) {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggle()
                }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-rose-500 transition-colors"
                aria-label={liked ? 'Unlike this post' : 'Like this post'}
            >
                <Heart
                    className={`h-3.5 w-3.5 transition-all duration-300 ${liked ? 'fill-rose-500 text-rose-500' : ''
                        } ${isAnimating ? 'scale-125' : 'scale-100'}`}
                />
                {!isLoading && <span>{count}</span>}
            </button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={`group gap-2 rounded-full px-4 transition-all duration-300 ${liked
                    ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-500/10'
                    : 'text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10'
                }`}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
        >
            <Heart
                className={`h-4 w-4 transition-all duration-300 ${liked ? 'fill-rose-500' : 'fill-none'
                    } ${isAnimating ? 'scale-[1.3]' : 'scale-100'}`}
            />
            {!isLoading && (
                <span className="text-sm font-medium tabular-nums">{count}</span>
            )}
        </Button>
    )
}
