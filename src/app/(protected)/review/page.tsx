'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TopicCloud } from '@/components/review/TopicCloud'
import { ReviewActions } from '@/components/review/ReviewActions'
import { useToast } from '@/components/ui/use-toast'
import { useJournalStore } from '@/lib/store/journal'
import { useChatStore } from '@/lib/store/chat'

interface Topic {
  id: string
  label: string
  selected: boolean
}

export default function ReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [topics, setTopics] = useState<Topic[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const journalEntry = useJournalStore((state) => state.currentEntry)
  const setChatContext = useChatStore((state) => state.setContext)

  useEffect(() => {
    if (!journalEntry) {
      router.push('/journal')
      toast({
        title: 'No journal entry found',
        description: 'Please write a journal entry first',
        variant: 'destructive',
      })
    }
  }, [journalEntry, router, toast])

  const handleTopicToggle = (topicId: string) => {
    setTopics(currentTopics =>
      currentTopics.map(topic =>
        topic.id === topicId
          ? { ...topic, selected: !topic.selected }
          : topic
      )
    )
  }

  const handlePublish = async () => {
    try {
      setIsSubmitting(true)
      const selectedTopics = topics.filter(t => t.selected).map(t => t.label)
      
      // Set the context for the chat
      setChatContext({
        journalEntry,
        topics: selectedTopics,
      })

      router.push('/chat')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process journal entry',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Review Your Entry</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground">
            {journalEntry?.substring(0, 200)}...
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Select Topics for AI Analysis
          </h2>
          
          <TopicCloud 
            topics={topics} 
            onTopicToggle={handleTopicToggle} 
          />
        </div>

        <ReviewActions
          onPublish={handlePublish}
          isSubmitting={isSubmitting}
          disabled={!topics.some(t => t.selected)}
        />
      </Card>
    </div>
  )
}
