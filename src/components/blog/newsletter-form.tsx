'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Check, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface NewsletterFormProps {
  variant?: 'default' | 'inline' | 'compact'
}

/**
 * NewsletterForm — psychology-optimized subscribe form.
 *
 * Design choices:
 * - Gradient glow on focus (draws the eye)
 * - Social proof indicators (trust signals)
 * - Urgency micro-copy ("Get it before anyone else")
 * - Success animation with checkmark
 * - Three trust badges: Free forever, No spam, Unsubscribe anytime
 */
export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setIsSuccess(true)
      toast.success("You're in! Welcome aboard.")
      
      // Brief delay to show success state
      setTimeout(() => {
        setEmail('')
        router.push('/subscribe/confirm')
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      toast.error(message)
      
      // Shake the input on error
      inputRef.current?.classList.add('animate-shake')
      setTimeout(() => {
        inputRef.current?.classList.remove('animate-shake')
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Compact variant (sidebar) ─────────────────────────────────── */
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading || isSuccess}
          className={cn(
            "flex-1 h-11 rounded-full transition-all",
            error && "border-destructive",
            isSuccess && "border-green-500"
          )}
        />
        <Button 
          type="submit" 
          disabled={isLoading || isSuccess} 
          size="default" 
          className={cn(
            "rounded-full h-11 min-w-[70px] transition-all",
            isSuccess && "bg-green-500 hover:bg-green-500"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 className="h-4 w-4 animate-scale-in" />
          ) : (
            'Join'
          )}
        </Button>
      </form>
    )
  }

  /* ── Inline variant ─────────────────────────────────────────────── */
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className={cn(
          "relative flex-1 focus-gradient rounded-full transition-all",
          error && "ring-2 ring-destructive/30",
          isSuccess && "ring-2 ring-green-500/30"
        )}>
          <Mail className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
            isSuccess ? "text-green-500" : "text-muted-foreground"
          )} />
          <Input
            ref={inputRef}
            type="email"
            placeholder="Enter your best email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null) }}
            required
            disabled={isLoading || isSuccess}
            className={cn(
              "pl-11 h-12 rounded-full border-2",
              error && "border-destructive",
              isSuccess && "border-green-500"
            )}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || isSuccess} 
          size="lg" 
          className={cn(
            "h-12 px-8 rounded-full transition-all",
            isSuccess && "bg-green-500 hover:bg-green-500"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4 animate-scale-in" />
              Subscribed!
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    )
  }

  /* ── Default variant (full CTA section) ─────────────────────────── */
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-6">
        <Mail className="h-8 w-8" />
      </div>

      <h3 className="text-3xl md:text-4xl font-bold mb-3"
        style={{ fontFamily: 'var(--font-serif-var), serif' }}>
        Don&#39;t miss the next one
      </h3>

      <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
        Get new articles delivered the moment they&#39;re published. Be the first to read, not the last to know.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <div className={cn(
          "relative flex-1 focus-gradient rounded-full transition-all",
          error && "ring-2 ring-destructive/30",
          isSuccess && "ring-2 ring-green-500/30"
        )}>
          <Mail className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
            isSuccess ? "text-green-500" : "text-muted-foreground"
          )} />
          <Input
            ref={inputRef}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null) }}
            required
            disabled={isLoading || isSuccess}
            className={cn(
              "pl-12 h-14 text-base rounded-full border-2",
              error && "border-destructive",
              isSuccess && "border-green-500"
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSuccess}
          size="lg"
          className={cn(
            "h-14 px-8 text-base font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all",
            isSuccess ? "bg-green-500 hover:bg-green-500" : "pulse-cta"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="h-5 w-5 animate-scale-in" />
              <span className="ml-2">Subscribed!</span>
            </>
          ) : (
            <>
              Subscribe <Sparkles className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          Free forever
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          No spam
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          Unsubscribe anytime
        </span>
      </div>
    </div>
  )
}
