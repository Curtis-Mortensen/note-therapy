import { useCallback, useEffect, useRef } from 'react'
import { useJournalStore } from '@/lib/store/journal'
import { uploadToS3 } from '@/lib/aws/s3'
import { debounce } from 'lodash'
import { useToast } from '@/components/ui/use-toast'

const AUTOSAVE_DELAY = 1000 // 1 second delay
const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds between retries

export function useAutosave(content: string, entryId: string) {
  const { toast } = useToast()
  const retryCount = useRef(0)
  const updateAutosaveStatus = useJournalStore(state => state.updateAutosaveStatus)
  const currentEntry = useJournalStore(state => state.currentEntry)
  const setCurrentEntry = useJournalStore(state => state.setCurrentEntry)

  // Save to S3 and update store
  const saveContent = useCallback(async (content: string) => {
    // Don't save if content is empty
    if (!content.trim()) {
      return
    }

    try {
      updateAutosaveStatus({ status: 'saving' })

      // Upload to S3
      await uploadToS3(`journals/${entryId}.json`, {
        content,
        updatedAt: new Date().toISOString(),
        id: entryId,
      })

      // Update store with success status
      updateAutosaveStatus({
        status: 'saved',
        lastSaved: new Date(),
      })

      // Update current entry in store
      if (currentEntry) {
        setCurrentEntry({
          ...currentEntry,
          content,
          updatedAt: new Date().toISOString(),
        })
      }

      // Reset retry counter on successful save
      retryCount.current = 0

    } catch (error) {
      console.error('Autosave error:', error)
      
      // Implement retry logic
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current += 1
        
        setTimeout(() => {
          saveContent(content)
        }, RETRY_DELAY)

        updateAutosaveStatus({
          status: 'saving',
          error: `Retrying save (${retryCount.current}/${MAX_RETRIES})...`
        })
      } else {
        // If all retries failed
        updateAutosaveStatus({
          status: 'error',
          error: 'Failed to save after multiple attempts'
        })

        toast({
          variant: 'destructive',
          title: 'Failed to save',
          description: 'Your changes could not be saved. Please check your connection.',
        })
      }
    }
  }, [entryId, currentEntry, setCurrentEntry, updateAutosaveStatus, toast])

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce((content: string) => {
      saveContent(content)
    }, AUTOSAVE_DELAY),
    [saveContent]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  // Watch content changes and trigger save
  useEffect(() => {
    if (content.trim()) {
      debouncedSave(content)
    }
  }, [content, debouncedSave])

  // Implement beforeunload handler for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const status = useJournalStore.getState().autosaveStatus.status
      if (status === 'saving') {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return {
    status: useJournalStore(state => state.autosaveStatus),
    saveNow: () => saveContent(content), // Expose immediate save function
  }
}
