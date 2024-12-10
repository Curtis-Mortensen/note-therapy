'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { Message } from '@/types/chat'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, isLoading } = useChat()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    await sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
      <Card className="flex flex-col flex-1 bg-background">
        <ScrollArea 
          ref={scrollRef}
          className="flex-1 p-4 space-y-4"
        >
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted text-muted-foreground mr-4'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground rounded-lg p-3">
                Thinking...
              </div>
            </div>
          )}
        </ScrollArea>

        <form 
          onSubmit={handleSubmit}
          className="p-4 border-t flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[180px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}
