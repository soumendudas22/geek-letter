'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  onSearch: (query: string) => Promise<string | void> | string | void
  placeholder?: string
  initialQuery?: string
}

export function SearchBar({ onSearch, placeholder = 'Search posts...', initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const isNavigating = useRef(false)

  const navigate = async (q: string) => {
    if (isNavigating.current) return
    isNavigating.current = true
    try {
      const result = await onSearch(q)
      if (typeof result === 'string') {
        router.push(result)
      }
    } catch (err) {
      console.error('[SearchBar] navigation failed:', err)
    } finally {
      isNavigating.current = false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(query)
  }

  const handleClear = () => {
    setQuery('')
    navigate('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
}
