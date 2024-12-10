export interface AutosaveStatus {
    status: 'idle' | 'saving' | 'saved' | 'error'
    lastSaved?: Date
    error?: string
  }
  