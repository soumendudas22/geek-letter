'use client'

import { useState } from 'react'
import { Share2, Link2, Check, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonsProps {
    title: string
    slug: string
}

/**
 * ShareButtons — floating share panel for blog posts.
 * Supports copy-to-clipboard, Twitter/X, and LinkedIn sharing.
 * Uses native Web Share API on mobile when available.
 */
export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)
    const url = typeof window !== 'undefined'
        ? `${window.location.origin}/blog/${slug}`
        : `/blog/${slug}`

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            toast.success('Link copied to clipboard!')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Failed to copy link')
        }
    }

    const shareOnTwitter = () => {
        const text = encodeURIComponent(`${title}\n\n${url}`)
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener')
    }

    const shareOnLinkedIn = () => {
        const encodedUrl = encodeURIComponent(url)
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            '_blank',
            'noopener'
        )
    }

    return (
        <div className="flex items-center gap-1.5">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyLink}
                className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                title="Copy link"
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Link2 className="h-4 w-4" />
                )}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={shareOnTwitter}
                className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                title="Share on X (Twitter)"
            >
                <Twitter className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={shareOnLinkedIn}
                className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                title="Share on LinkedIn"
            >
                <Linkedin className="h-4 w-4" />
            </Button>
        </div>
    )
}

/**
 * FloatingShareBar — fixed sidebar share buttons visible while reading.
 */
export function FloatingShareBar({ title, slug }: ShareButtonsProps) {
    const [isVisible, setIsVisible] = useState(false)

    // Show share bar after scrolling past the header
    if (typeof window !== 'undefined') {
        // Using a self-invoking pattern to set up scroll listener
        if (!isVisible) {
            const handleVisibility = () => {
                if (window.scrollY > 400) {
                    setIsVisible(true)
                    window.removeEventListener('scroll', handleVisibility)
                }
            }
            window.addEventListener('scroll', handleVisibility, { passive: true })
        }
    }

    return (
        <div
            className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 p-2 rounded-2xl glass-card transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
        >
            <span className="text-xs text-muted-foreground text-center mb-1">
                <Share2 className="h-3.5 w-3.5 mx-auto" />
            </span>
            <ShareButtons title={title} slug={slug} />
        </div>
    )
}
