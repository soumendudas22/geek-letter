'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Users,
  LogOut,
  Menu,
  Sparkles,
  ExternalLink,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
  { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
]

/**
 * AdminSidebar — polished sidebar with gradient logo, active link indicator,
 * dark mode toggle, and smooth transitions.
 */
export function AdminSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const NavLinks = () => (
    <>
      {/* Logo section with gradient */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm">Geek Letter</span>
          <span className="text-xs text-muted-foreground">Admin Panel</span>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  'flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 touch-target no-tap-highlight active:scale-[0.98]',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="h-5 w-5 md:h-4 md:w-4" />
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t pt-4 mt-4 space-y-1">
        {/* Dark mode toggle - only show on desktop sidebar */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        )}
        <Link href="/blog" target="_blank">
          <span className="flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-target no-tap-highlight active:scale-[0.98]">
            <ExternalLink className="h-5 w-5 md:h-4 md:w-4" />
            View Blog
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors touch-target no-tap-highlight active:scale-[0.98]"
        >
          <LogOut className="h-5 w-5 md:h-4 md:w-4" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-card/50 p-4 fixed inset-y-0 left-0 z-40">
        <NavLinks />
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 w-full h-14 border-b bg-background/95 backdrop-blur-xl z-50 flex items-center justify-between px-3 safe-area-top">
        <div className="flex items-center gap-2 min-w-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0 touch-target no-tap-highlight">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4 flex flex-col safe-area-bottom">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <NavLinks />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent text-white shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm truncate">Admin</span>
          </div>
        </div>

        {/* Mobile dark mode toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0 touch-target no-tap-highlight"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </>
  )
}
