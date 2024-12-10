'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AlertDialog, 
         AlertDialogContent, 
         AlertDialogHeader,
         AlertDialogTitle,
         AlertDialogDescription,
         AlertDialogFooter,
         AlertDialogCancel,
         AlertDialogAction } from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface ReviewActionsProps {
  onPublish: () => Promise<void>
  isSubmitting: boolean
  disabled: boolean
}

export function ReviewActions({
  onPublish,
  isSubmitting,
  disabled
}: ReviewActionsProps) {
  const router = useRouter()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleBack = () => {
    router.push('/journal')
  }

  const handlePublishClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmedPublish = async () => {
    setShowConfirmDialog(false)
    await onPublish()
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Back to Journal
        </Button>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto"
        >
          <Button
            onClick={handlePublishClick}
            disabled={disabled || isSubmitting}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Publish to AI'
            )}
          </Button>
        </motion.div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to analyze your journal?</AlertDialogTitle>
            <AlertDialogDescription>
              Your journal entry will be processed by AI based on your selected topics.
              The AI will provide personalized insights and feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedPublish}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Add loading skeleton for better composition
export function ReviewActionsSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
      <div className="w-full sm:w-[100px] h-10 bg-muted rounded-md animate-pulse" />
      <div className="w-full sm:w-[200px] h-10 bg-muted rounded-md animate-pulse" />
    </div>
  )
}
