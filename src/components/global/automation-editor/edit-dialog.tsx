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
import { Combobox } from '@/components/ui/combobox'
import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'

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
  const [selectedListener, setSelectedListener] = React.useState<'MESSAGE' | 'AI'>(
    data?.listener?.listener || 'MESSAGE'
  )
  const [prompt, setPrompt] = React.useState(data?.listener?.prompt || '')
  const [reply, setReply] = React.useState<string | null>(data?.listener?.commentReply || null)
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(data?.listener?.agentId || null)

  // Fetch agents for the dropdown
  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const agents = await db.agent.findMany({
        where: { active: true }
      })
      return agents.map(agent => ({
        value: agent.id,
        label: agent.name
      }))
    }
  })

  // Reset states when dialog opens
  React.useEffect(() => {
    if (open && automationData?.data) {
      setSelectedTriggers(automationData.data.trigger.map((t: any) => t.type))
      setSelectedListener(automationData.data.listener?.listener || 'MESSAGE')
      setPrompt(automationData.data.listener?.prompt || '')
      setReply(automationData.data.listener?.commentReply || null)
      setSelectedAgent(automationData.data.listener?.agentId || null)
    }
  }, [open, automationData])

  const handleSubmit = async () => {
    if (type === 'trigger') {
      await updateTriggers({ triggers: selectedTriggers })
    } else {
      await updateListener({
        listener: selectedListener,
        prompt,
        commentReply: reply,
        agentId: selectedListener === 'AI' ? selectedAgent : null
      })
    }
    await refetch()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Edit {type === 'trigger' ? 'Trigger' : 'Response'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {type === 'trigger' ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {AUTOMATION_TRIGGERS.map((trigger) => (
                  <div
                    key={trigger.value}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border p-4 cursor-pointer',
                      selectedTriggers.includes(trigger.value) &&
                        'border-primary'
                    )}
                    onClick={() => {
                      if (selectedTriggers.includes(trigger.value)) {
                        setSelectedTriggers(
                          selectedTriggers.filter((t) => t !== trigger.value)
                        )
                      } else {
                        setSelectedTriggers([...selectedTriggers, trigger.value])
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <trigger.icon className="h-4 w-4" />
                      <h3 className="font-semibold">{trigger.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trigger.description}
                    </p>
                  </div>
                ))}
              </div>
              {selectedTriggers.includes('KEYWORD') && (
                <KeywordInput id={id} keywords={[]} onRefresh={function (): void {
                  throw new Error('Function not implemented.')
                } } />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {AUTOMATION_LISTENERS.map((listener) => (
                  <div
                    key={listener.value}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border p-4 cursor-pointer',
                      selectedListener === listener.value && 'border-primary'
                    )}
                    onClick={() => {
                      setSelectedListener(listener.value as 'MESSAGE' | 'AI')
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <listener.icon className="h-4 w-4" />
                      <h3 className="font-semibold">{listener.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {listener.description}
                    </p>
                  </div>
                ))}
              </div>

              {selectedListener === 'AI' && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Select AI Agent</label>
                  <Combobox
                    items={agentsData || []}
                    value={selectedAgent || ''}
                    onChange={(value) => setSelectedAgent(value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {selectedListener === 'MESSAGE'
                    ? 'Message'
                    : 'Instructions for AI'}
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    selectedListener === 'MESSAGE'
                      ? 'Enter your message'
                      : 'Enter instructions for the AI'
                  }
                  className="h-32"
                />
              </div>

              {selectedListener === 'MESSAGE' && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Comment Reply (Optional)
                  </label>
                  <Input
                    value={reply || ''}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Enter your reply"
                  />
                </div>
              )}
            </div>
          )}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isTriggerPending || isListenerPending}
          >
            {isTriggerPending || isListenerPending ? (
              <Loader state={false} children={undefined} />
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialog
