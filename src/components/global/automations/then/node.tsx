'use client'
import { Separator } from '@/components/ui/separator'
import { useQueryAutomation } from '@/hooks/user-queries'
import { PlaneBlue, SmartAi, Warning } from '@/icons'
import React from 'react'
import PostButton from '../post'
import { PencilIcon } from 'lucide-react'
import EditDialog from '../../automation-editor/edit-dialog'

type Props = {
  id: string
}

const ThenNode = ({ id }: Props) => {
  const { data } = useQueryAutomation(id)
  const [editOpen, setEditOpen] = React.useState(false)
  const commentTrigger = data?.data?.trigger.find((t) => t.type === 'COMMENT')
  const isDMOnly = data?.data?.trigger.every((t) => t.type === 'DM')

  return !data?.data?.listener ? (
    <></>
  ) : (
    <>
      <div className="w-full lg:w-10/12 relative xl:w-6/12 p-5 rounded-xl flex flex-col bg-[#1D1D1D] gap-y-3">
        <button 
          onClick={() => setEditOpen(true)}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-background-80 transition-colors"
        >
          <PencilIcon size={16} />
        </button>
        <div className="absolute h-20 left-1/2 bottom-full flex flex-col items-center z-50">
          <span className="h-[9px] w-[9px] bg-connector/10 rounded-full" />
          <Separator
            orientation="vertical"
            className="bottom-full flex-1 border-[1px] border-connector/10"
          />
          <span className="h-[9px] w-[9px] bg-connector/10 rounded-full" />
        </div>
        <div className="flex gap-x-2">
          <Warning />
          Then...
        </div>
        <div className="bg-background-80 p-3 rounded-xl flex flex-col gap-y-2">
          <div className="flex gap-x-2 items-center">
            {data.data.listener.listener === 'MESSAGE' ? (
              <PlaneBlue />
            ) : (
              <SmartAi />
            )}
            <p className="text-lg">
              {data.data.listener.listener === 'MESSAGE'
                ? 'Send the user a message.'
                : 'Let Smart AI take over'}
            </p>
          </div>
          <p className="font-light text-text-secondary">
            {data.data.listener.prompt}
          </p>
        </div>
        {data.data.posts.length === 0 && commentTrigger && !isDMOnly && (
          <PostButton id={id} />
        )}
      </div>
      <EditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        type="response"
        data={data.data}
        id={id}
      />
    </>
  )
}

export default ThenNode
