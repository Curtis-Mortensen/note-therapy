'use client'

import { useCallback, useEffect, useState } from 'react'
import { useJournalStore } from '@/lib/store/journal'
import { useAutosave } from '@/hooks/useAutosave'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import TextareaAutosize from 'react-textarea-autosize'

const MAX_CHARS = 5000

export function JournalEditor() {
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  
  const currentEntry = useJournalStore(state => state.currentEntry)
  const setCurrentEntry = useJournalStore(state => state.setCurrentEntry)
  const addEntry = useJournalStore(state => state.addEntry)

  // Initialize or load existing entry
  useEffect(() => {
    if (!currentEntry) {
      const newEntry = {
        id: uuidv4(),
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: '', // TODO: Get from auth context
        status: 'draft' as const,
        wordCount: 0,
      }
      addEntry(newEntry)
    } else {
      setContent(currentEntry.content)
      setWordCount(currentEntry.content.trim().split(/\s+/).length)
    }
  }, [currentEntry, addEntry])

  // Initialize autosave
  const { status: autosaveStatus, saveNow } = useAutosave(
    content,
    currentEntry?.id || ''
  )

  // Handle content changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    
    // Check character limit
    if (newContent.length > MAX_CHARS) {
      toast({
        title: "Character limit reached",
        description: `Your entry cannot exceed ${MAX_CHARS} characters`,
        variant: "destructive",
      })
      return
    }

    setContent(newContent)
    const words = newContent.trim() ? newContent.trim().split(/\s+/).length : 0
    setWordCount(words)

    if (currentEntry) {
      setCurrentEntry({
        ...currentEntry,
        content: newContent,
        wordCount: words,
        updatedAt: new Date().toISOString(),
      })
    }
  }, [currentEntry, setCurrentEntry, toast])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      saveNow()
    }
  }, [saveNow])

  return (
    <div className="relative min-h-[calc(100vh-12rem)] w-full max-w-4xl mx-auto">
      {/* Word count */}
      <div className="absolute top-2 right-2 text-sm text-muted-foreground">
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>

      {/* Editor */}
      <TextareaAutosize
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Start writing your thoughts..."
        className={cn(
          "w-full h-full p-4 bg-background resize-none focus:outline-none",
          "text-lg leading-relaxed placeholder:text-muted-foreground/50",
          "transition-colors duration-200",
          isFocused ? "bg-background" : "bg-muted/30",
          "min-h-[calc(100vh-12rem)]"
        )}
        maxLength={MAX_CHARS}
      />

      {/* Character count */}
      <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
        {content.length}/{MAX_CHARS}
      </div>
    </div>
  )
}
