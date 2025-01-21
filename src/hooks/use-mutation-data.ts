import { useMutation, type MutationKey, useMutationState, useQueryClient } from '@tanstack/react-query'
import { toast } from './use-toast'

interface UseMutationDataOptions<TData, TVariables> {
  mutationKey: MutationKey
  mutationFn: (variables: TVariables) => Promise<TData>
  queryKey?: string
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
  showSuccessToast?: boolean
  successMessage?: string
  errorMessage?: string
}

export function useMutationData<TData, TVariables>({
  mutationKey,
  mutationFn,
  queryKey,
  onSuccess,
  onError,
  showSuccessToast = true,
  successMessage = 'Operation successful',
  errorMessage = 'Operation failed'
}: UseMutationDataOptions<TData, TVariables>) {
  const client = useQueryClient()
  const mutation = useMutation<TData, Error, TVariables>({
    mutationKey,
    mutationFn,
    onSuccess: (data) => {
      if (showSuccessToast) {
        toast({
          title: successMessage,
          variant: 'default',
        })
      }
      onSuccess?.(data)
      client.invalidateQueries({ queryKey: [queryKey] })
    },
    onError: (error) => {
      toast({
        title: errorMessage,
        description: error.message,
        variant: 'destructive',
      })
      onError?.(error)
    },
  })

  return {
    ...mutation,
    mutate: (variables: TVariables) => mutation.mutate(variables),
  }
}

export function useMutationDataSimple<TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  showSuccessToast = true,
  successMessage = 'Operation successful',
  errorMessage = 'Operation failed'
}: Omit<UseMutationDataOptions<TData, TVariables>, 'mutationKey' | 'queryKey'>) {
  const mutation = useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data) => {
      if (showSuccessToast) {
        toast({
          title: successMessage,
          variant: 'default',
        })
      }
      onSuccess?.(data)
    },
    onError: (error) => {
      toast({
        title: errorMessage,
        description: error.message,
        variant: 'destructive',
      })
      onError?.(error)
    },
  })

  return {
    ...mutation,
    mutate: (variables: TVariables) => mutation.mutate(variables),
  }
}

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      }
    },
  })

  const latestVariable = data[data.length - 1]
  return { latestVariable }
}
