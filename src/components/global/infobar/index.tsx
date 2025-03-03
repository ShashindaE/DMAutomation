'use client'

import { PAGE_BREAD_CRUMBS } from '@/constants/pages'
import { usePaths } from '@/hooks/user-nav'
import { Menu } from 'lucide-react'
import React from 'react'
import Sheet from '../sheet'
import Items from '../sidebar/items'
import { Separator } from '@/components/ui/separator'
import ClerkAuthState from '../clerk-auth-state'
import { HelpDuoToneWhite } from '@/icons'
import { SubscriptionPlan } from '../subscription-plan'
import UpgradeCard from '../sidebar/upgrade'
import { LogoSmall } from '@/svgs/logo-small'
import CreateAutomation from '../create-automation'
import Search from './search'
import { Notifications } from './notifications'
import MainBreadCrumb from '../bread-crumbs/main-bread-crumb'

type Props = {
  workspaceId: string
}

const InfoBar = ({ workspaceId }: Props) => {
  const { page } = usePaths()

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-x-3 lg:gap-x-5">
        <span className="lg:hidden flex items-center gap-x-2">
          <Sheet
            trigger={<Menu />}
            className="lg:hidden"
            side="left"
          >
            <div className="flex flex-col gap-y-5 w-full h-full p-3 bg-[#0e0e0e] bg-opacity-90 bg-clip-padding backdrop-filter backdrop--blur__safari backdrop-blur-3xl">
              <div className="flex gap-x-2 items-center p-5 justify-center">
                <LogoSmall />
              </div>
              <div className="flex flex-col py-3">
                <Items
                  page={page}
                  slug={workspaceId}
                />
              </div>
              <div className="px-16">
                <Separator
                  orientation="horizontal"
                  className="bg-[#333336]"
                />
              </div>
              <div className="px-3 flex flex-col gap-y-5">
                <div className="flex gap-x-2">
                  <ClerkAuthState />
                  <p className="text-[#9B9CA0]">Profile</p>
                </div>
                <div className="flex gap-x-3">
                  <HelpDuoToneWhite />
                  <p className="text-[#9B9CA0]">Help</p>
                </div>
              </div>
              <SubscriptionPlan type="FREE">
                <div className="flex-1 flex flex-col justify-end">
                  <UpgradeCard />
                </div>
              </SubscriptionPlan>
            </div>
          </Sheet>
        </span>
        <div className="flex-1">
          <Search slug={workspaceId} />
        </div>
        <CreateAutomation />
        <Notifications />
      </div>
      <MainBreadCrumb
        page={page === workspaceId ? 'Home' : page}
        slug={workspaceId}
      />
    </div>
  )
}

export default InfoBar
