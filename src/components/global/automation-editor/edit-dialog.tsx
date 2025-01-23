'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AUTOMATION_LISTENERS, AUTOMATION_TRIGGERS } from '@/constants/automation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SubscriptionPlan } from '../subscription-plan'
import Loader from '../loader'
import { useAutomationEdit } from '@/hooks/use-automation-edit'
import { useQueryAutomation } from '@/hooks/user-queries'
import KeywordInput from './keyword-input'

type Props = {
  open: boolean
  onClose: () => void
  type: 'trigger' | 'response'
  data: any
  id: string
}

const EditDialog = ({ open, onClose, type, data, id }: Props) => {
  const { data: automationData, refetch } = useQueryAutomation(id)
  const {
    isTriggerPending,
    isListenerPending,
    updateTriggers,
    updateListener,
  } = useAutomationEdit(id)

  const [selectedTriggers, setSelectedTriggers] = React.useState<string[]>(
    data?.trigger?.map((t: any) => t.type) || []
  )
  const [selectedListener, setSelectedListener] = React.useState(
    data?.listener?.listener || 'MESSAGE'
  )
  const [prompt, setPrompt] = React.useState(data?.listener?.prompt || '')
  const [reply, setReply] = React.useState(data?.listener?.commentReply || '')

  // Reset states when dialog opens
  React.useEffect(() => {
    if (open && automationData?.data) {
      setSelectedTriggers(automationData.data.trigger.map((t: any) => t.type))
      setSelectedListener(automationData.data.listener?.listener || 'MESSAGE')
      setPrompt(automationData.data.listener?.prompt || '')
      setReply(automationData.data.listener?.commentReply || '')
    }
  }, [open, automationData])

  const handleSave = async () => {
    try {
      if (type === 'trigger') {
        await updateTriggers({ triggers: selectedTriggers })
      } else {
        await updateListener({
          listener: selectedListener,
          prompt,
          reply: selectedTriggers.includes('COMMENT') ? reply : undefined,
        })
      }
      await refetch()
      onClose()
    } catch (error) {
      console.error('Failed to save changes:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none text-white">
        <DialogHeader>
          <DialogTitle>
            Edit {type === 'trigger' ? 'Trigger' : 'Response'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-4">
          {type === 'trigger' ? (
            <>
              <div className="flex flex-col gap-y-2">
                {AUTOMATION_TRIGGERS.map((trigger) => (
                  <div
                    key={trigger.id}
                    onClick={() => {
                      const newTriggers = selectedTriggers.includes(trigger.type)
                        ? selectedTriggers.filter((t) => t !== trigger.type)
                        : [...selectedTriggers, trigger.type]
                      setSelectedTriggers(newTriggers)
                    }}
                    className={cn(
                      selectedTriggers.includes(trigger.type)
                        ? 'bg-gradient-to-br from-[#3352CC] to-[#1C2D70]'
                        : 'bg-background-80',
                      'p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100'
                    )}
                  >
                    <div className="flex gap-x-2 items-center">
                      {trigger.icon}
                      <p className="font-bold">{trigger.label}</p>
                    </div>
                    <p className="text-sm font-light">{trigger.description}</p>
                  </div>
                ))}
                <KeywordInput id={id} keywords={data.keywords} onRefresh={refetch} />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-y-2">
                {AUTOMATION_LISTENERS.map((l) =>
                  l.type === 'SMARTAI' ? (
                    <SubscriptionPlan key={l.id} type="PRO">
                      <div
                        onClick={() => setSelectedListener(l.type)}
                        className={cn(
                          selectedListener === l.type
                            ? 'bg-gradient-to-br from-[#3352CC] to-[#1C2D70]'
                            : 'bg-background-80',
                          'p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100'
                        )}
                      >
                        <div className="flex gap-x-2 items-center">
                          {l.icon}
                          <p className="font-bold">{l.label}</p>
                        </div>
                        <p className="text-sm font-light">{l.description}</p>
                      </div>
                    </SubscriptionPlan>
                  ) : (
                    <div
                      key={l.id}
                      onClick={() => setSelectedListener(l.type)}
                      className={cn(
                        selectedListener === l.type
                          ? 'bg-gradient-to-br from-[#3352CC] to-[#1C2D70]'
                          : 'bg-background-80',
                        'p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100'
                      )}
                    >
                      <div className="flex gap-x-2 items-center">
                        {l.icon}
                        <p className="font-bold">{l.label}</p>
                      </div>
                      <p className="text-sm font-light">{l.description}</p>
                    </div>
                  )
                )}
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    selectedListener === 'SMARTAI'
                      ? 'Add a prompt that your smart ai can use...'
                      : 'Add a message you want to send to your customers'
                  }
                  className="bg-background-80 outline-none border-none ring-0 focus:ring-0"
                />
                {selectedTriggers.includes('COMMENT') && (
                  <Input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Add a reply for comments (Optional)"
                    className="bg-background-80 outline-none border-none ring-0 focus:ring-0"
                  />
                )}
              </div>
            </>
          )}
          <Button
            onClick={handleSave}
            disabled={type === 'response' && !prompt}
            className="bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]"
          >
            <Loader state={type === 'trigger' ? isTriggerPending : isListenerPending}>
              Save Changes
            </Loader>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialog
