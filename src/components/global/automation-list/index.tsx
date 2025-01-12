'use client'
import { usePaths } from '@/hooks/user-nav'
import { cn, getMonth } from '@/lib/utils'
import Link from 'next/link'
import React, { useMemo } from 'react'
import GradientButton from '../gradient-button'
import { Button } from '@/components/ui/button'
import { useQueryAutomations } from '@/hooks/user-queries'
import CreateAutomation from '../create-automation'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import DeleteAutomation from '../automations/delete-automation'

type Keyword = {
  id: string
  word: string
}

type Automation = {
  id: string
  name: string
  createdAt: string | Date
  active: boolean
  keywords: Keyword[]
  listener?: {
    listener: 'SMARTAI' | 'MESSAGE'
  }
}

type Props = {}

const AutomationList = (props: Props) => {
  const { data } = useQueryAutomations()
  const { latestVariable } = useMutationDataState(['create-automation'])
  const { pathname } = usePaths()
  
  const optimisticUiData = useMemo(() => {
    if (!data?.data) return { data: [] }
    
    // If we have a new automation being created
    if (latestVariable?.variables && latestVariable.status === 'pending') {
      return { data: [latestVariable.variables, ...data.data] as Automation[] }
    }
    
    return { data: data.data as Automation[] }
  }, [latestVariable, data])

  // Only show empty state if there's no data and no pending creation
  const showEmptyState = !data?.data?.length && !latestVariable?.variables
  
  if (showEmptyState) {
    return (
      <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
        <h3 className="text-lg text-gray-400">No Automations </h3>
        <CreateAutomation />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-3">
      {optimisticUiData.data.map((automation) => (
        <div
          key={automation.id}
          className="bg-[#1D1D1D] hover:opacity-80 transition duration-100 rounded-xl p-5 border-[1px] radial--gradient--automations flex border-[#545454] group"
        >
          <Link
            href={`${pathname}/${automation.id}`}
            className="flex-1 flex"
          >
            <div className="flex flex-col flex-1 items-start">
              <h2 className="text-xl font-semibold">{automation.name}</h2>
              <p className="text-[#9B9CA0] text-sm font-light mb-2">
                {automation.active ? 'Active' : 'Inactive'}
              </p>

              {automation.keywords?.length > 0 ? (
                <div className="flex gap-x-2 flex-wrap mt-3">
                  {automation.keywords.map((keyword: Keyword) => (
                    <div
                      key={keyword.id}
                      className={cn(
                        'rounded-full px-4 py-1 capitalize',
                        'bg-keyword-green/15 border-2 border-keyword-green'
                      )}
                    >
                      {keyword.word}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-full border-2 mt-3 border-dashed border-white/60 px-3 py-1">
                  <p className="text-sm text-[#bfc0c3]">No Keywords</p>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between">
              <p className="capitalize text-sm font-light text-[#9B9CA0]">
                {getMonth(new Date(automation.createdAt).getUTCMonth() + 1)}{' '}
                {new Date(automation.createdAt).getUTCDate() === 1
                  ? `${new Date(automation.createdAt).getUTCDate()}st`
                  : `${new Date(automation.createdAt).getUTCDate()}th`}{' '}
                {new Date(automation.createdAt).getUTCFullYear()}
              </p>

              {automation.listener?.listener === 'SMARTAI' ? (
                <GradientButton
                  type="BUTTON"
                  className="w-full bg-background-80 text-white hover:bg-background-80"
                >
                  Smart AI
                </GradientButton>
              ) : (
                <Button className="bg-background-80 hover:bg-background-80 text-white">
                  Standard
                </Button>
              )}
            </div>
          </Link>
          <div className="flex items-start ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteAutomation
              automationId={automation.id}
              automationName={automation.name}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AutomationList
