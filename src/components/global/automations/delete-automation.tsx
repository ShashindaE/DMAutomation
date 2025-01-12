'use client'

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteAutomation } from '@/actions/automations/delete'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'

type Props = {
  automationId: string
  automationName: string
}

const DeleteAutomation = ({ automationId, automationName }: Props) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const [isOpen, setIsOpen] = React.useState(false)

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationKey: ['delete-automation', automationId],
    mutationFn: () => deleteAutomation(automationId),
    onSuccess: (result) => {
      if (result.success) {
        // Optimistically update the cache
        queryClient.setQueryData(['user-automations'], (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.filter((automation: any) => automation.id !== automationId)
          }
        })

        toast({
          title: 'Success',
          description: `"${automationName}" has been deleted`,
        })
        setIsOpen(false)
        
        // Get the base path without the automation ID
        const basePath = window.location.pathname.split('/').slice(0, -1).join('/')
        router.push(basePath)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete automation',
          variant: 'destructive',
        })
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10 hover:text-destructive"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Automation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{automationName}"? This action cannot be undone.
            All associated data including triggers, listeners, and responses will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAutomation
