import Link from 'next/link'
import { Sparkles, Twitter, Linkedin, Github } from 'lucide-react'
import { NewsletterForm } from '@/components/blog/newsletter-form'

/**
 * Footer — premium footer with gradient top border, social links,
 * inline subscribe form, and brand personality.
 */
export function Footer() {
  return (
    <footer className="border-t relative">
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container lg:max-w-[70%] py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">Geek Letter</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Curated insights on technology, design, and building products that matter. Written with care, delivered with purpose.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Navigate</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition-colors w-fit">
                Home
              </Link>
              <Link href="/blog" className="text-sm text-foreground/70 hover:text-foreground transition-colors w-fit">
                Blog
              </Link>
              <a href="/#subscribe" className="text-sm text-foreground/70 hover:text-foreground transition-colors w-fit">
                Subscribe
              </a>
            </nav>
          </div>

          {/* Geek Letter */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get new articles delivered to your inbox. No spam, unsubscribe anytime.
            </p>
            <NewsletterForm variant="compact" />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Geek Letter. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <span className="text-red-400">❤</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
