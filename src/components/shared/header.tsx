'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, Sparkles, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
]

/**
 * Header — scroll-aware sticky header with dark mode toggle.
 * Shrinks and increases blur on scroll for a premium feel.
 */
export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
        ? 'bg-background/90 backdrop-blur-xl shadow-sm border-border/50'
        : 'bg-background/60 backdrop-blur-md border-transparent'
        }`}
    >
      <div className={`container lg:max-w-[70%] flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'
        }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white transition-transform group-hover:scale-105 shadow-sm">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Geek Letter</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-muted"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Dark mode toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          <a href="/#subscribe">
            <Button size="sm" className="h-9 rounded-full px-5 pulse-cta font-medium">
              Subscribe
            </Button>
          </a>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground">
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-1 md:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full touch-target no-tap-highlight"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 touch-target no-tap-highlight">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] safe-area-top safe-area-bottom">
              <div className="flex flex-col mt-8 h-full">
                <div className="flex items-center gap-2.5 mb-8 pb-6 border-b">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">Geek Letter</span>
                </div>

                <nav className="flex flex-col gap-1 stagger-children">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-4 text-base font-medium rounded-xl transition-all hover:bg-muted active:scale-[0.98] touch-target no-tap-highlight"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col gap-3 mt-auto pt-6 border-t">
                  <a href="/#subscribe" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 rounded-full text-base">Subscribe</Button>
                  </a>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-full text-base">Admin</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
