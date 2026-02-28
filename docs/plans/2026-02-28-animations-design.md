# Animation System Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a cohesive, elegant animation system across the entire public-facing newsletter app using the `motion` library, with loading screens, page transitions, scroll reveals, and interactive spring animations.

**Architecture:** Install `motion` (Framer Motion successor). Create three shared infrastructure pieces (PageTransition, FadeIn/FadeInStagger, loading.tsx). Apply motion progressively to public pages and components. Leave admin panel untouched.

**Tech Stack:** Next.js 16 App Router, motion (`motion/react`), Tailwind CSS v4, existing CSS keyframes (kept for micro-details already working)

---

## Section 1: Infrastructure

### 1a. Install `motion`
```bash
npm install motion
```

### 1b. `src/components/shared/page-transition.tsx` (new file)
Client component. Uses `usePathname()` as AnimatePresence key. Wraps children in fade+slide up transition.

```tsx
'use client'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### 1c. `src/components/shared/fade-in.tsx` (new file)
Two exports: `FadeIn` (single element, whileInView) and `FadeInStagger` (maps children with staggered delay).

```tsx
'use client'
import { motion } from 'motion/react'

// Single element — fades in when scrolled into view
export function FadeIn({ children, delay = 0, className }: {...}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Grid/list — each child gets index * 0.08s stagger
export function FadeInStagger({ children, className }: {...}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
```

### 1d. `src/app/(public)/loading.tsx` (new file)
Next.js loading UI — shown during server-side fetching between route navigations.

```tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-muted border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
```

---

## Section 2: Layout wiring

### 2a. `src/app/(public)/layout.tsx` — wrap children with PageTransition
Add `<PageTransition>` around `{children}`. Import from shared.

### 2b. `src/components/shared/header.tsx` — entrance animation
Wrap the existing `<header>` element in `motion.header` (or `motion.div` wrapping it):
```tsx
<motion.header
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
```

---

## Section 3: Public page animations

### 3a. Homepage (`src/app/(public)/page.tsx`)
- Hero badge, headline, subtitle, CTA buttons: replace `animate-fade-up` CSS classes with `motion.div` stagger sequence:
  - Badge: delay 0ms
  - Headline: delay 0.1s
  - Subtitle: delay 0.2s
  - CTA buttons: delay 0.3s
- "Latest Articles" header: `FadeIn`
- Post cards grid: `FadeInStagger` (remove old `.stagger-children` class)

### 3b. Blog listing (`src/app/(public)/blog/page.tsx`)
- Page header (h1 + subtitle): `FadeIn`
- Render the `<PostList>` inside `FadeInStagger` or pass stagger down through `PostList`

### 3c. Post card (`src/components/blog/post-card.tsx`)
Convert outermost div to `motion.div`:
```tsx
<motion.div
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
```
Remove `.card-hover` CSS class (replaced by spring motion).

### 3d. Post content (`src/components/blog/post-content.tsx`)
- Cover image container: `FadeIn` with `scale: 0.97 → 1`
- Title, byline, meta row: staggered FadeIn (delay 0, 0.1, 0.2)
- Related posts section header: `FadeIn`
- Related post cards: `FadeInStagger`

---

## Section 4: Interactive component animations

### 4a. Like button (`src/components/blog/like-button.tsx`)
```tsx
<motion.button
  whileHover={{ scale: 1.15 }}
  whileTap={{ scale: 0.85 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  <motion.span
    animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    <Heart />
  </motion.span>
</motion.button>
```

### 4b. Newsletter form (`src/components/blog/newsletter-form.tsx`)
- Form container: `motion.div` with `animate` controlled by state
- Error shake: `animate={{ x: [-6, 6, -4, 4, 0] }}` triggered on error
- Success: form fades out (`opacity: 0, scale: 0.95`), success message fades in (`opacity: 0, scale: 0.8 → 1`)
- Submit button: `whileTap: { scale: 0.97 }`, loading spinner via `motion.div` rotating

### 4c. Animated hero orbs (`src/components/blog/animated-hero.tsx`)
Replace `animate-float` CSS with `motion.div`:
```tsx
<motion.div
  animate={{ y: [0, -12, 6, 0], rotate: [0, 2, -1, 0] }}
  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
/>
```
Different `duration` per orb (6s, 7s, 8s) for organic feel.

### 4d. Search bar (`src/components/blog/search-bar.tsx`)
No layout animation needed — the existing CSS focus styles are sufficient. Keep as-is.

---

## Files Changed

| File | Action |
|------|--------|
| `package.json` | Add `motion` |
| `src/components/shared/page-transition.tsx` | Create |
| `src/components/shared/fade-in.tsx` | Create |
| `src/components/shared/index.ts` | Export new components |
| `src/app/(public)/loading.tsx` | Create |
| `src/app/(public)/layout.tsx` | Add PageTransition wrapper |
| `src/components/shared/header.tsx` | Entrance animation |
| `src/app/(public)/page.tsx` | Motion hero + FadeInStagger |
| `src/app/(public)/blog/page.tsx` | FadeIn header + stagger posts |
| `src/components/blog/post-card.tsx` | Spring hover/tap |
| `src/components/blog/post-content.tsx` | Staggered reveal |
| `src/components/blog/like-button.tsx` | Spring like animation |
| `src/components/blog/newsletter-form.tsx` | Shake + success transition |
| `src/components/blog/animated-hero.tsx` | Motion orbs |

**Not changed:** All admin components, API routes, auth, database types.
