import { Skeleton } from "@/components/ui/skeleton"

export default function JournalLoading() {
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-10 rounded-full" /> {/* Sidebar toggle */}
        <Skeleton className="h-9 w-24" /> {/* "I'm Done" button */}
      </div>

      {/* Editor Loading State */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" /> {/* Title placeholder */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-9/12" />
        </div>
      </div>

      {/* Status Indicator */}
      <div className="fixed bottom-4 left-4">
        <Skeleton className="h-6 w-24" /> {/* Autosave status */}
      </div>
    </div>
  )
}
