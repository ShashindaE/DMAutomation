import { Input } from '@/components/ui/input'
import { useKeywords } from '@/hooks/use-automations'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { useQueryAutomation } from '@/hooks/user-queries'
import { X } from 'lucide-react'
import React from 'react'
import cn from 'classnames'

type Props = {
  id: string
}

export const Keywords = ({ id }: Props) => {
  const { onValueChange, keyword, onKeyPress, deleteMutation } = useKeywords(id)
  const { latestVariable } = useMutationDataState(['add-keyword'])
  const { data } = useQueryAutomation(id)

  const [isSmartTriggerActive, setSmartTriggerActive] = React.useState(false);

  const handleSmartTriggerClick = () => {
    setSmartTriggerActive(!isSmartTriggerActive);
    if (!isSmartTriggerActive) {
      onValueChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>); // Clear keywords when activating Smart Trigger
    }
  };

  return (
    <div className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl">
      <p className="text-sm text-text-secondary">
        Add words that trigger automations
      </p>
      <div className="flex flex-wrap justify-start gap-2 items-center">
        {data?.data?.keywords &&
          data?.data?.keywords.length > 0 &&
          data?.data?.keywords.map(
            (word) =>
              (!latestVariable?.variables?.id || word.id !== latestVariable.variables.id) && (
                <div
                  className="bg-background-90 flex items-center gap-x-2 capitalize text-text-secondary py-1 px-4 rounded-full"
                  key={word.id}
                >
                  <p>{word.word}</p>
                </div>
              )
          )}
        {latestVariable && latestVariable.status === 'pending' && (
          <div className="bg-background-90 flex items-center gap-x-2 capitalize text-text-secondary py-1 px-4 rounded-full">
            {latestVariable.variables.keyword}
          </div>
        )}
        <Input
          placeholder="Add keyword..."
          style={{
            width: Math.min(Math.max(keyword.length || 10, 2), 50) + 'ch',
            opacity: isSmartTriggerActive ? 0.5 : 1,
            pointerEvents: isSmartTriggerActive ? 'none' : 'auto',
          }}
          value={keyword}
          className="p-0 bg-transparent ring-0 border-none outline-none"
          onChange={(e) => {
            onValueChange(e);
            // Check if the input is empty or not
            if (e.target.value.length === 0) {
              setSmartTriggerActive(false);
            } else {
              setSmartTriggerActive(false); // Ensure Smart Trigger is inactive when keywords are present
            }
          }}
          onKeyUp={onKeyPress}
        />
        {keyword.length === 0 && (
          <div className="relative flex items-center">
            <span className="text-text-secondary mr-2">or</span>
            <button
              className={cn(
                'flex items-center rounded-md px-3 py-1 ml-2',
                isSmartTriggerActive ? 'bg-gradient-to-br from-[#3352CC] to-[#1C2D70] text-white' : 'bg-gray-400 text-black'
              )}
              title="AI-powered trigger that understands user intent"
              onClick={handleSmartTriggerClick}
              disabled={keyword.length > 0}
            >
              Smart Trigger
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default Keywords
