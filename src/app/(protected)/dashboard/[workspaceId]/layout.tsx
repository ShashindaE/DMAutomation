import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/global/sidebar'
import React from 'react'
import {
  PrefetchUserAutnomations,
  PrefetchUserProfile,
} from '@/react-query/prefetch'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

type Props = {
  children: React.ReactNode
  params: { workspaceId: string }
}

const Layout = async ({ children, params }: Props) => {
  const query = new QueryClient()
  const user = await currentUser()
  
  if (!user) {
    return null
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkId: user.id
    }
  })

  const userName = dbUser?.firstname || user.firstName || ''

  await PrefetchUserProfile(query)
  await PrefetchUserAutnomations(query)

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="p-3">
        <Sidebar workspaceId={params.workspaceId} />
        <div
          className="
      lg:ml-[250px] 
      lg:pl-10 
      lg:py-5 
      flex 
      flex-col 
      overflow-auto
      "
        >
          <InfoBar workspaceId={params.workspaceId} userName={userName} />
          {children}
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout
