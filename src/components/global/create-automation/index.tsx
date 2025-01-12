'use client'

import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import React, { useMemo } from 'react'
import Loader from '../loader'
import { AutomationDuoToneWhite } from '@/icons'
import { useCreateAutomation } from '@/hooks/use-automations'
import { v4 } from 'uuid'

type Props = {}

const CreateAutomation = (props: Props) => {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  const mutationId = useMemo(() => v4(), [])
  const { isPending, mutate } = useCreateAutomation(mutationId)

  const handleCreateAutomation = async () => {
    try {
      await mutate({
        name: 'Untitled',
        id: mutationId,
        createdAt: new Date(),
        keywords: [],
      })
      toast.success('Automation created successfully')
      router.push(`/dashboard/${slug}/automations/${mutationId}`)
    } catch (error) {
      console.error('Error creating automation:', error)
      toast.error('Failed to create automation. Please try again.')
    }
  }

  return (
    <Button
      className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70]"
      onClick={handleCreateAutomation}
      disabled={isPending}
    >
      <Loader state={isPending}>
        <AutomationDuoToneWhite />
        <p className="lg:inline hidden">Create an Automation</p>
      </Loader>
    </Button>
  )
}

export default CreateAutomation
