import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessage: string
  topics: string[]
  journalEntryId?: string
}

interface ChatHistoryState {
  sessions: ChatSession[]
  isLoading: boolean
  error: Error | null
  lastAccessedId: string | null
  setSessions: (sessions: ChatSession[]) => void
  addSession: (session: ChatSession) => void
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void
  deleteSession: (sessionId: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
  setLastAccessedId: (id: string | null) => void
}

export const useChatHistoryStore = create<ChatHistoryState>()(
  devtools(
    persist(
      (set) => ({
        sessions: [],
        isLoading: false,
        error: null,
        lastAccessedId: null,
        setSessions: (sessions) => set({ sessions }),
        addSession: (session) =>
          set((state) => ({
            sessions: [session, ...state.sessions],
            lastAccessedId: session.id,
          })),
        updateSession: (sessionId, updates) =>
          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === sessionId
                ? { ...session, ...updates, updatedAt: new Date().toISOString() }
                : session
            ),
          })),
        deleteSession: (sessionId) =>
          set((state) => ({
            sessions: state.sessions.filter((session) => session.id !== sessionId),
            lastAccessedId:
              state.lastAccessedId === sessionId
                ? state.sessions[0]?.id || null
                : state.lastAccessedId,
          })),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setLastAccessedId: (id) => set({ lastAccessedId: id }),
      }),
      {
        name: 'chat-history-storage',
      }
    )
  )
)
