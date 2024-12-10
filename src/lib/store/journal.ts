import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AutosaveStatus } from '@/types/journal'

export interface JournalEntry {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  status: 'draft' | 'completed'
  wordCount: number
}

interface JournalState {
  currentEntry: JournalEntry | null
  autosaveStatus: AutosaveStatus
  entries: JournalEntry[]
  setCurrentEntry: (entry: JournalEntry) => void
  updateAutosaveStatus: (status: AutosaveStatus) => void
  addEntry: (entry: JournalEntry) => void
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void
  deleteEntry: (id: string) => void
  clearCurrentEntry: () => void
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      currentEntry: null,
      entries: [],
      autosaveStatus: {
        status: 'idle',
      },
      
      setCurrentEntry: (entry) => 
        set({ currentEntry: entry }),
      
      updateAutosaveStatus: (status) => 
        set({ autosaveStatus: status }),
      
      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, entry],
          currentEntry: entry,
        })),
      
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
          currentEntry:
            state.currentEntry?.id === id
              ? { ...state.currentEntry, ...updates }
              : state.currentEntry,
        })),
      
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
          currentEntry:
            state.currentEntry?.id === id ? null : state.currentEntry,
        })),
      
      clearCurrentEntry: () =>
        set({ currentEntry: null }),
    }),
    {
      name: 'journal-storage',
      partialize: (state) => ({
        entries: state.entries,
        // Don't persist currentEntry or autosaveStatus
      }),
    }
  )
)
