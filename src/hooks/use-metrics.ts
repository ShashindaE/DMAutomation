import { getMetrics, MetricsResponse } from '@/actions/metrics/queries'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'

export const useMetrics = (days: number = 30) => {
  const { user } = useUser()

  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery<MetricsResponse>({
    queryKey: ['metrics', user?.id, days],
    queryFn: () => getMetrics(user?.id || '', days),
    enabled: !!user?.id,
    refetchInterval: 60000, // Refetch every minute
  })

  return {
    metrics,
    isLoading,
    error: error as Error,
  }
}
