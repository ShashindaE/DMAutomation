import { saveListener, updateTrigger } from '@/actions/automations/mutations'
import { addKeyWord, deleteKeywordQuery } from '@/actions/automations/queries'
import { useMutationData } from './use-mutation-data'
import { toast } from 'sonner'

export const useAutomationEdit = (id: string) => {
  const { isPending: isTriggerPending, mutate: updateTriggers } = useMutationData(
    ['update-trigger'],
    async (data: { triggers: string[] }) => {
      try {
        const result = await updateTrigger(id, data.triggers)
        toast.success('Trigger updated successfully')
        return result
      } catch (error) {
        toast.error('Failed to update trigger')
        throw error
      }
    },
    'automation-info'
  )

  const { isPending: isListenerPending, mutate: updateListener } = useMutationData(
    ['update-listener'],
    async (data: { listener: string; prompt: string; reply?: string }) => {
      try {
        const result = await saveListener(
          id,
          data.listener as 'MESSAGE' | 'SMARTAI',
          data.prompt,
          data.reply
        )
        toast.success('Response updated successfully')
        return result
      } catch (error) {
        toast.error('Failed to update response')
        throw error
      }
    },
    'automation-info'
  )

  const addKeyword = async (automationId: string, keyword: string) => {
    try {
      const result = await addKeyWord(automationId, keyword)
      toast.success('Keyword added')
      return result
    } catch (error) {
      toast.error('Failed to add keyword')
      throw error
    }
  }

  const deleteKeyword = async (automationId: string, keywordId: string) => {
    try {
      await deleteKeywordQuery(automationId, keywordId)
      toast.success('Keyword deleted')
    } catch (error) {
      toast.error('Failed to delete keyword')
      throw error
    }
  }

  return {
    isTriggerPending,
    isListenerPending,
    updateTriggers,
    updateListener,
    addKeyword,
    deleteKeyword,
  }
}