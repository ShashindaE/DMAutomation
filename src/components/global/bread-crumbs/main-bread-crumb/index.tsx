'use client'
import { PAGE_ICON } from '@/constants/pages'
import { useQueryAutomation } from '@/hooks/user-queries'
import React from 'react'

type Props = {
  page: string
  slug?: string
}

const MainBreadCrumb = ({ page, slug }: Props) => {
  // Check if page is a UUID (automation ID)
  const isAutomationId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(page)
  const { data: automationData } = useQueryAutomation(isAutomationId ? page : '')

  const getDisplayTitle = () => {
    if (isAutomationId) {
      return automationData?.data?.name || 'Automation'
    }
    return page
  }

  return (
    <div className="flex flex-col items-start">
      {page === 'Home' && (
        <div className="flex justify-center w-full">
          <div className="radial--gradient w-4/12 py-5 lg:py-10 flex flex-col items-center">
            <p className="text-text-secondary text-lg">Welcome back</p>
            <h2 className="capitalize text-4xl font-medium">
              {slug?.split(' ')[0] || 'User'}!
            </h2>
          </div>
        </div>
      )}
      <span className="radial--gradient inline-flex py-5 lg:py-10 pr-16 gap-x-2 items-center">
        {PAGE_ICON[isAutomationId ? 'AUTOMATIONS' : page.toUpperCase()] || PAGE_ICON.AUTOMATIONS}
        <h2 className="font-semibold text-3xl capitalize">{getDisplayTitle()}</h2>
      </span>
    </div>
  )
}

export default MainBreadCrumb
