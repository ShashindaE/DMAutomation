'use client'
import { usePaths } from '@/hooks/user-nav'
import { LogoSmall } from '@/svgs/logo-small'
import React from 'react'
import Items from './items'
import { Separator } from '@/components/ui/separator'
import ClerkAuthState from '../clerk-auth-state'
import { HelpDuoToneWhite } from '@/icons'
import { SubscriptionPlan } from '../subscription-plan'
import UpgradeCard from './upgrade'

type Props = {
  workspaceId: string
}

const Sidebar = ({ workspaceId }: Props) => {
  const { page } = usePaths()

  return (
    <div
      className="w-[250px] 
      h-screen 
      fixed 
      left-0 
      top-0 
      bg-[#1E1E1E] 
      text-white 
      flex 
      flex-col 
      justify-between
      "
    >
      <div>
        <div className="p-5">
          <LogoSmall />
        </div>
        <div className="px-4">
          <Items slug={workspaceId} page="dashboard" />
        </div>
        <Separator className="my-4" />
        <div className="px-4">
          <ClerkAuthState />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <HelpDuoToneWhite />
          <span className="text-sm">Help & Support</span>
        </div>
        <SubscriptionPlan type="FREE">
          <UpgradeCard />
        </SubscriptionPlan>
      </div>
    </div>
  )
}

export default Sidebar
