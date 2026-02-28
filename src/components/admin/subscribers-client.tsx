'use client'

import { SubscriberTable } from '@/components/admin'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Subscriber } from '@/types/database'

interface SubscribersPageClientProps {
  initialSubscribers: Subscriber[]
}

export function SubscribersPageClient({
  initialSubscribers,
}: SubscribersPageClientProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/subscribers/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }

      setSubscribers(subscribers.filter((s) => s.id !== id))
      toast.success('Subscriber deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete')
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Subscribers</h1>
        <p className="text-muted-foreground text-sm shrink-0">
          {subscribers.length} total
        </p>
      </div>

      <SubscriberTable subscribers={subscribers} onDelete={handleDelete} />
    </div>
  )
}
