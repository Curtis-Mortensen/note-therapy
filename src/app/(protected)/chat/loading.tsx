import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
      <Card className="flex flex-col flex-1 bg-background">
        <div className="flex-1 p-4 space-y-4">
          {/* Simulate multiple message bubbles */}
          <div className="flex justify-start">
            <Skeleton className="h-[60px] w-[250px] rounded-lg" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-[40px] w-[200px] rounded-lg" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-[80px] w-[300px] rounded-lg" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-[40px] w-[180px] rounded-lg" />
          </div>
        </div>

        {/* Input area skeleton */}
        <div className="p-4 border-t flex gap-2">
          <Skeleton className="flex-1 h-[60px] rounded-md" />
          <Skeleton className="h-[60px] w-[60px] rounded-md" />
        </div>
      </Card>
    </div>
  )
}
