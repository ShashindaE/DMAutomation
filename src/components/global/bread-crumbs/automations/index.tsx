'use client'
import { ChevronRight, PencilIcon } from 'lucide-react'
import React from 'react'
import ActivateAutomationButton from '../../activate-automation-button'
import { useQueryAutomation } from '@/hooks/user-queries'
import { useEditAutomation } from '@/hooks/use-automations'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Props = {
  id: string
}

const AutomationsBreadCrumb = ({ id }: Props) => {
  const { data } = useQueryAutomation(id)
  const { edit, enableEdit, inputRef, isPending } = useEditAutomation(id)
  const { latestVariable } = useMutationDataState(['update-automation'])
  const params = useParams()

  const automationName = latestVariable?.variables?.name || data?.data?.name || 'New Automation'

  return (
    <div className="rounded-full w-full p-5 bg-[#18181B1A] flex items-center">
      <div className="flex items-center gap-x-3 min-w-0">
        <Link 
          href={`/dashboard/${params.workspaceId}/automations`}
          className="text-[#9B9CA0] hover:text-white transition-colors"
        >
          Automations
        </Link>
        <ChevronRight
          className="flex-shrink-0"
          color="#9B9CA0"
        />
        <span className="flex gap-x-3 items-center min-w-0">
          {edit ? (
            <Input
              ref={inputRef}
              placeholder={isPending ? latestVariable.variables : 'Add a new name'}
              className="bg-transparent h-auto outline-none text-base border-none p-0"
            />
          ) : (
            <p className="text-[#9B9CA0] truncate">
              {automationName}
            </p>
          )}
          {edit ? (
            <></>
          ) : (
            <span
              className="cursor-pointer hover:opacity-75 duration-100 transition flex-shrink-0 mr-4"
              onClick={enableEdit}
            >
              <PencilIcon size={14} />
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-x-5 ml-auto">
        <p className="hidden md:block text-text-secondary/60 text-sm truncate min-w-0">
          All states are automatically saved
        </p>
        <div className="flex gap-x-5 flex-shrink-0">
          <p className="text-text-secondary text-sm truncate min-w-0">
            Changes Saved
          </p>
        </div>
      </div>

      <div className="flex-shrink-0">
        <ActivateAutomationButton id={id} />
      </div>
    </div>
  )
}

export default AutomationsBreadCrumb
