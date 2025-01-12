'use client'

import { Input } from '@/components/ui/input'
import { SearchIcon, X } from 'lucide-react'
import React from 'react'
import { useSearch } from '@/hooks/use-search'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'

type Props = {
  slug?: string
}

const Search = ({ slug }: Props) => {
  const router = useRouter()
  const { searchTerm, setSearchTerm, searchResults, isLoading, error } = useSearch()

  return (
    <div className="relative w-full max-w-[600px]">
      <div className="flex overflow-hidden gap-x-2 border-[1px] border-[#3352CC] rounded-full px-4 py-1 items-center flex-1">
        <SearchIcon color="#3352CC" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search automations by name or keywords"
          className="border-none outline-none ring-0 focus:ring-0 flex-1"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      {searchTerm && (
        <div className="absolute top-full mt-2 w-full z-50">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Automations">
                {searchResults.map((automation) => (
                  <CommandItem
                    key={automation.id}
                    onSelect={() => {
                      router.push(`/dashboard/${slug}/automations/${automation.id}`)
                      setSearchTerm('')
                    }}
                  >
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{automation.name}</p>
                      {automation.keywords.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Keywords: {automation.keywords.map(k => k.word).join(', ')}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-2">
          Error: {error.message || 'Failed to search automations'}
        </p>
      )}
    </div>
  )
}

export default Search
