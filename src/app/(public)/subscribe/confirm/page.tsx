'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Sparkles, Share2, Twitter, Linkedin, Link2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

/**
 * ConfirmPage — celebration page after subscribing.
 *
 * Features:
 * - Confetti-style animation (CSS gradient orbs)
 * - Share-after-subscribe virality CTA
 * - Smooth fade-in entrance
 */
export default function ConfirmPage() {
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setShowCelebration(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied! Share it with a friend.')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Celebration gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-float opacity-20"
          style={{ background: 'oklch(0.42 0.18 270 / 0.4)' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl animate-float animation-delay-300 opacity-15"
          style={{ background: 'oklch(0.68 0.19 25 / 0.4)' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full blur-3xl animate-float animation-delay-600 opacity-10"
          style={{ background: 'oklch(0.55 0.20 310 / 0.4)' }}
        />
      </div>

      <div className={`container max-w-lg text-center py-16 relative transition-all duration-700 ${showCelebration ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-green-500/20 text-green-500 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
          style={{ fontFamily: 'var(--font-serif-var), serif' }}
        >
          You&apos;re in! 🎉
        </h1>

        <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
          Welcome aboard! You&apos;ll get every new article delivered straight to your inbox. No spam, ever.
        </p>

        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/">
            <Button size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20">
              <Sparkles className="mr-2 h-5 w-5" />
              Explore Articles
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full">
              View Blog
            </Button>
          </Link>
        </div>

        {/* Virality: Share CTA */}
        <div className="p-6 rounded-2xl glass-card">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Know someone who&apos;d love this?</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Share this newsletter and help a friend discover great content.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-full gap-2"
            >
              <Link2 className="h-4 w-4" /> Copy Link
            </Button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just subscribed to this amazing newsletter! Check it out: ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <Twitter className="h-4 w-4" /> Tweet
              </Button>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <Linkedin className="h-4 w-4" /> Share
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
