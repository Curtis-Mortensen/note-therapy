'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface Topic {
  id: string
  label: string
  selected: boolean
}

interface TopicCloudProps {
  topics?: Topic[]
  onTopicToggle: (topicId: string) => void
  maxSelections?: number
}

const DEFAULT_TOPICS: Topic[] = [
  { id: 'task-breakdown', label: 'Task Breakdown', selected: false },
  { id: 'prioritization', label: 'Prioritization', selected: false },
  { id: 'anxiety', label: 'Anxiety Perspective', selected: false },
  { id: 'self-reflection', label: 'Self-Reflection', selected: false },
  { id: 'goals', label: 'Custom Goals', selected: false },
  { id: 'empathy', label: 'Empathy and Understanding', selected: false },
  { id: 'relationships', label: 'Relationship Advice', selected: false },
]

export function TopicCloud({
  topics = DEFAULT_TOPICS,
  onTopicToggle,
  maxSelections = 3
}: TopicCloudProps) {
  const [selectedCount, setSelectedCount] = useState(0)

  const handleTopicClick = (topicId: string, isSelected: boolean) => {
    if (!isSelected && selectedCount >= maxSelections) {
      return // Prevent selecting more than max allowed
    }
    
    setSelectedCount(prev => isSelected ? prev - 1 : prev + 1)
    onTopicToggle(topicId)
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <motion.div
            key={topic.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer text-sm py-2 px-4 hover:shadow-md transition-all duration-200",
                "border-2",
                topic.selected && "bg-primary text-primary-foreground border-primary",
                !topic.selected && selectedCount >= maxSelections && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleTopicClick(topic.id, topic.selected)}
            >
              {topic.label}
            </Badge>
          </motion.div>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground mt-2">
        Select up to {maxSelections} topics for AI analysis
        ({selectedCount}/{maxSelections} selected)
      </p>
    </div>
  )
}

// Add loading skeleton component for better composition
export function TopicCloudSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-8 w-24 rounded-full bg-muted animate-pulse"
        />
      ))}
    </div>
  )
}
