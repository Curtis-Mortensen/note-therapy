'use client'

import { useEffect, useState } from 'react'
import { useJournalStore } from '@/lib/store/journal'
import { CheckCircle, CloudOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { AutosaveStatus } from '@/types/journal'

export function AutosaveIndicator() {
  const { toast } = useToast()
  const status = useJournalStore((state) => state.autosaveStatus)
  const [showStatus, setShowStatus] = useState(true)

  useEffect(() => {
    if (status.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Autosave Failed',
        description: status.error || 'Failed to save your changes. Please try again.',
      })
    }

    // Hide the "Saved" status after 3 seconds
    if (status.status === 'saved') {
      const timer = setTimeout(() => setShowStatus(false), 3000)
      return () => clearTimeout(timer)
    }

    setShowStatus(true)
  }, [status, toast])

  if (!showStatus && status.status === 'saved') return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm font-medium transition-opacity duration-200',
        status.status === 'error' ? 'text-destructive' : 'text-muted-foreground'
      )}
    >
      {status.status === 'saving' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      )}

      {status.status === 'saved' && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Saved</span>
          {status.lastSaved && (
            <span className="text-xs text-muted-foreground">
              {new Date(status.lastSaved).toLocaleTimeString()}
            </span>
          )}
        </>
      )}

      {status.status === 'error' && (
        <>
          <CloudOff className="h-4 w-4" />
          <span>Save failed</span>
        </>
      )}

      {status.status === 'idle' && (
        <span className="text-muted-foreground">Ready</span>
      )}
    </div>
  )
}
