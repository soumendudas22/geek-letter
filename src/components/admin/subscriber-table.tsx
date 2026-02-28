'use client'

import { useState } from 'react'
import { Trash2, Mail, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { Subscriber } from '@/types/database'

interface SubscriberTableProps {
  subscribers: Subscriber[]
  onDelete: (id: string) => Promise<void>
}

/**
 * SubscriberTable — responsive table/card layout.
 *
 * Mobile (<md): Stacked card layout with labeled fields.
 * Desktop (md+): Standard horizontal table.
 */
export function SubscriberTable({ subscribers, onDelete }: SubscriberTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No subscribers yet.
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: Card layout ─────────────────────────────── */}
      <div className="space-y-3 md:hidden">
        {subscribers.map((subscriber) => (
          <Card key={subscriber.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium truncate">{subscriber.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => handleDelete(subscriber.id)}
                  disabled={deletingId === subscriber.id}
                >
                  {deletingId === subscriber.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between gap-3">
                {subscriber.is_active ? (
                  <Badge variant="default" className="bg-green-500/90 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Unsubscribed
                  </Badge>
                )}

                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(subscriber.subscribed_at)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Desktop: Table layout ───────────────────────────── */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {subscriber.email}
                  </div>
                </TableCell>
                <TableCell>
                  {subscriber.is_active ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Unsubscribed
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(subscriber.subscribed_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(subscriber.id)}
                    disabled={deletingId === subscriber.id}
                  >
                    {deletingId === subscriber.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
