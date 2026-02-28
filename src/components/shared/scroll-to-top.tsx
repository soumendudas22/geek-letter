'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ScrollToTop — floating button that appears on scroll.
 * Smoothly scrolls to top when clicked.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 p-3 rounded-full',
        'bg-primary text-primary-foreground shadow-lg shadow-primary/20',
        'hover:shadow-xl hover:shadow-primary/30 hover:scale-110',
        'active:scale-95 transition-all duration-300',
        'opacity-0 translate-y-4 pointer-events-none',
        'touch-target no-tap-highlight',
        visible && 'opacity-100 translate-y-0 pointer-events-auto'
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
