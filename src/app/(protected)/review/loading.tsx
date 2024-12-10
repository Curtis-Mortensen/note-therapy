import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ReviewLoading() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6 space-y-6">
        {/* Title skeleton */}
        <Skeleton className="h-8 w-48" />
        
        {/* Journal preview skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[85%]" />
        </div>

        {/* Topics section title skeleton */}
        <Skeleton className="h-7 w-56 mt-8" />

        {/* Topic cloud skeleton */}
        <div className="flex flex-wrap gap-2 py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-24 rounded-full"
            />
          ))}
        </div>

        {/* Action button skeleton */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  )
}
