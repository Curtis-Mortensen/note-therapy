'use client'

import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useS3Upload } from '@/hooks/useS3Upload'
import { useAuth } from '@/hooks/useAuth'
import { useChatStore } from '@/lib/store/chat'
import { Message, ChatOptions } from '@/types/chat'

const BATCH_THRESHOLD = 5
const AUTOSAVE_INTERVAL = 30000 // 30 seconds

export function useChat({
  chatId = uuidv4(),
  journalContext = '',
  selectedTopics = [],
  initialMessages = []
}: ChatOptions = {}) {
  const { user } = useAuth()
  const { uploadToS3, getFromS3 } = useS3Upload()
  const messageQueue = useRef<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Zustand store actions
  const {
    messages,
    addMessage,
    setMessages,
    clearMessages
  } = useChatStore()

  // Initialize chat from S3 if existing chatId
  useEffect(() => {
    const loadExistingChat = async () => {
      if (!user?.id || !chatId) return

      try {
        const existingMessages = await getFromS3(`chats/${user.id}/${chatId}/messages.json`)
        if (existingMessages) {
          setMessages(existingMessages)
        } else if (initialMessages.length > 0) {
          setMessages(initialMessages)
        }
      } catch (err) {
        console.error('Failed to load chat history:', err)
        setError(new Error('Failed to load chat history'))
      }
    }

    loadExistingChat()
  }, [chatId, user?.id])

  // Autosave timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messageQueue.current.length > 0) {
        persistMessagesToS3()
      }
    }, AUTOSAVE_INTERVAL)

    return () => {
      clearInterval(intervalId)
      if (messageQueue.current.length > 0) {
        persistMessagesToS3()
      }
    }
  }, [])

  const persistMessagesToS3 = async () => {
    if (!user?.id || messageQueue.current.length === 0) return

    try {
      await uploadToS3({
        path: `chats/${user.id}/${chatId}/messages.json`,
        data: messages
      })
      messageQueue.current = []
    } catch (err) {
      console.error('Failed to persist messages:', err)
      // Keep messages in queue for retry
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user?.id) return

    try {
      setIsLoading(true)
      setError(null)

      // Create and add user message
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      }
      addMessage(userMessage)
      messageQueue.current.push(userMessage)

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          journalContext,
          selectedTopics,
          chatId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const { reply } = await response.json()

      // Create and add AI message
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString()
      }
      addMessage(aiMessage)
      messageQueue.current.push(aiMessage)

      // Check if we should persist to S3
      if (messageQueue.current.length >= BATCH_THRESHOLD) {
        await persistMessagesToS3()
      }

    } catch (err) {
      console.error('Error in sendMessage:', err)
      setError(err instanceof Error ? err : new Error('Failed to send message'))
    } finally {
      setIsLoading(false)
    }
  }

  const resetChat = async () => {
    try {
      clearMessages()
      messageQueue.current = []
      if (user?.id) {
        await uploadToS3({
          path: `chats/${user.id}/${chatId}/messages.json`,
          data: []
        })
      }
    } catch (err) {
      console.error('Failed to reset chat:', err)
      setError(new Error('Failed to reset chat'))
    }
  }

  return {
    messages,
    sendMessage,
    resetChat,
    isLoading,
    error,
    chatId
  }
}