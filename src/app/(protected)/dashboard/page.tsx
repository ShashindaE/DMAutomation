import { onBoardUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {
  const user = await onBoardUser()
  
  if (user.status === 500) {
    console.error('Error in dashboard:', user.error)
    return redirect('/error')
  }
  
  if (user.status === 200 || user.status === 201) {
    return redirect(`/dashboard/${user.data.workspaceId}`)
  }

  return redirect('/sign-in')
}

export default Page
