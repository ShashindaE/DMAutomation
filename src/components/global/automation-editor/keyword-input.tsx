'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useAutomationEdit } from '@/hooks/use-automation-edit'
import { useQueryClient } from '@tanstack/react-query'

interface KeywordInputProps {
  id: string
  keywords: Array<{ id: string; keyword: string }>
  onRefresh: () => void
}

const KeywordInput: React.FC<KeywordInputProps> = ({ id, keywords, onRefresh }) => {
  const [inputValue, setInputValue] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)
  const { addKeyword, deleteKeyword } = useAutomationEdit(id)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const refreshData = async () => {
    await Promise.all([
      queryClient.invalidateQueries(['automation-info', id]),
      queryClient.invalidateQueries(['user-automations']),
      queryClient.refetchQueries(['automation-info', id]),
      queryClient.refetchQueries(['user-automations'])
    ])
    onRefresh()
  }

  const validateKeyword = (keyword: string): boolean => {
    if (!keyword.trim()) {
      toast.error('Keyword cannot be empty')
      return false
    }

    const isDuplicate = keywords.some(
      (k) => k.keyword.toLowerCase() === keyword.toLowerCase()
    )
    if (isDuplicate) {
      toast.error('This keyword already exists')
      return false
    }

    if (keyword.length > 50) {
      toast.error('Keyword is too long (max 50 characters)')
      return false
    }

    const validKeywordRegex = /^[a-zA-Z0-9\s\-_]+$/
    if (!validKeywordRegex.test(keyword)) {
      toast.error('Keyword can only contain letters, numbers, spaces, hyphens, and underscores')
      return false
    }

    return true
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      e.preventDefault()
      
      const keyword = inputValue.trim()
      if (!validateKeyword(keyword)) {
        return
      }

      try {
        setIsProcessing(true)
        await addKeyword(id, keyword)
        setInputValue('')
        await refreshData()
      } catch (error) {
        console.error('Failed to add keyword:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleDelete = async (keywordId: string) => {
    if (isProcessing) return

    try {
      setIsProcessing(true)
      const result = await deleteKeyword(id, keywordId)
      if (!result) {
        await refreshData()
        return
      }
      await refreshData()
    } catch (error) {
      console.error('Failed to delete keyword:', error)
      await refreshData()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-sm text-text-secondary">Keywords</p>
      <div className="flex gap-2 flex-wrap">
        {keywords.map((k) => (
          <div
            key={k.id}
            className="bg-gradient-to-br from-[#3352CC] to-[#1C2D70] px-3 py-1 rounded-full text-sm flex items-center gap-x-2 group transition-all duration-200"
          >
            {k.keyword}
            <button
              onClick={() => handleDelete(k.id)}
              className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all duration-200"
              disabled={isProcessing}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type keyword and press Enter"
        className="bg-background-80 border-none"
        disabled={isProcessing}
      />
    </div>
  )
}

export default KeywordInput
