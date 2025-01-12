import { searchAutomations } from '@/actions/automations/queries'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from './use-debounce'
import { useState } from 'react'

export const useSearch = () => {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search-automations', debouncedSearch, user?.id],
    queryFn: async () => {
      if (!user?.id || !debouncedSearch) {
        return { data: [] }
      }
      return searchAutomations(user.id, debouncedSearch)
    },
    enabled: Boolean(debouncedSearch && user?.id),
    staleTime: 1000, // Cache results for 1 second
  })

  return {
    searchTerm,
    setSearchTerm,
    searchResults: searchResults?.data || [],
    isLoading: isLoading && Boolean(debouncedSearch),
    error: error as Error,
  }
}
