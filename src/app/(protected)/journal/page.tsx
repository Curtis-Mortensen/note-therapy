import { Suspense } from 'react'
import { JournalEditor } from '@/components/journal/Editor'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-react'
import { AutosaveIndicator } from '@/components/journal/AutosaveIndicator'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata = {
  title: 'Journal Entry | Mindscape',
  description: 'Write your thoughts freely in a distraction-free environment',
}

export default function JournalPage() {
  return (
    <main className="container max-w-4xl mx-auto p-4 min-h-screen relative">
      <div className="flex justify-between items-center mb-8">
        {/* Sidebar Toggle - This would be connected to your existing sidebar */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          aria-label="Toggle navigation menu"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        {/* Done Button */}
        <Button
          className="fixed top-4 right-4 z-50"
          size="lg"
          variant="default"
          asChild
        >
          <a href="/review">I'm Done</a>
        </Button>
      </div>

      <ErrorBoundary fallback={<div>Something went wrong with the editor.</div>}>
        <Suspense fallback={<div>Loading editor...</div>}>
          <JournalEditor />
        </Suspense>
      </ErrorBoundary>

      {/* Autosave Indicator */}
      <div className="fixed bottom-4 left-4 z-50">
        <AutosaveIndicator />
      </div>
    </main>
  )
}
