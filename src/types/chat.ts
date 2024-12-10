export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    metadata?: {
      topicReferences?: string[]
      journalReferences?: string[]
      reactions?: string[]
    }
  }
  
  export interface ChatOptions {
    chatId?: string
    journalContext?: string
    selectedTopics?: string[]
    initialMessages?: Message[]
  }
  