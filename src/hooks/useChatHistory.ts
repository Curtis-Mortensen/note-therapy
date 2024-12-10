'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useS3Upload } from '@/hooks/useS3Upload'
import { useChatHistoryStore, ChatSession } from '@/lib/store/chatHistory'

export function useChatHistory() {
  const { user } = useAuth()
  const { getFromS3, uploadToS3 } = useS3Upload()
  
  const {
    sessions,
    isLoading,
    error,
    lastAccessedId,
    setSessions,
    addSession,
    updateSession,
    deleteSession,
    setLoading,
    setError,
    setLastAccessedId
  } = useChatHistoryStore()

  // Load chat history
  useEffect(() => {
    loadChatHistory()
  }, [user?.id])

  const loadChatHistory = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)

      const metadata = await getFromS3<{ sessions: ChatSession[], lastAccessedId: string | null }>(
        `users/${user.id}/chat-history/metadata.json`
      )

      if (metadata?.sessions) {
        setSessions(metadata.sessions)
        setLastAccessedId(metadata.lastAccessedId)
      }
    } catch (err) {
      console.error('Failed to load chat history:', err)
      setError(err instanceof Error ? err : new Error('Failed to load chat history'))
    } finally {
      setLoading(false)
    }
  }

  const addChatSession = async (sessionData: Omit<ChatSession, 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return

    try {
      const newSession: ChatSession = {
        ...sessionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      addSession(newSession)

      await uploadToS3({
        path: `users/${user.id}/chat-history/metadata.json`,
        data: {
          sessions: [newSession, ...sessions],
          lastAccessedId: newSession.id
        }
      })

      return newSession
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add chat session'))
      throw err
    }
  }

  const updateChatSession = async (
    sessionId: string,
    updates: Partial<Omit<ChatSession, 'id' | 'createdAt'>>
  ) => {
    if (!user?.id) return

    try {
      updateSession(sessionId, updates)

      await uploadToS3({
        path: `users/${user.id}/chat-history/metadata.json`,
        data: {
          sessions,
          lastAccessedId
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update chat session'))
      throw err
    }
  }

  const deleteChatSession = async (sessionId: string) => {
    if (!user?.id) return

    try {
      deleteSession(sessionId)

      // Delete chat messages
      await uploadToS3({
        path: `users/${user.id}/chats/${sessionId}/messages.json`,
        data: null
      })

      // Update metadata
      await uploadToS3({
        path: `users/${user.id}/chat-history/metadata.json`,
        data: {
          sessions: sessions.filter(session => session.id !== sessionId),
          lastAccessedId: sessions[0]?.id || null
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete chat session'))
      throw err
    }
  }

  // Utility functions
  const getRecentSessions = (limit: number = 5) => {
    return [...sessions]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
  }

  const searchSessions = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return sessions.filter(session => 
      session.title.toLowerCase().includes(lowercaseQuery) ||
      session.topics.some(topic => topic.toLowerCase().includes(lowercaseQuery))
    )
  }

  const getChatSessionsByJournal = (journalEntryId: string) => {
    return sessions.filter(session => session.journalEntryId === journalEntryId)
  }

  return {
    sessions,
    isLoading,
    error,
    lastAccessedId,
    addChatSession,
    updateChatSession,
    deleteChatSession,
    getRecentSessions,
    searchSessions,
    getChatSessionsByJournal,
    refresh: loadChatHistory
  }
}
