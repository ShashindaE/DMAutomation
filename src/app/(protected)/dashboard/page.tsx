import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async () => {
  const user = await currentUser()
  if (!user) {
    return redirect('/sign-in')
  }

  // Check if user exists in our database
  let dbUser = await db.user.findUnique({
    where: {
      clerkId: user.id
    },
    include: {
      workspaces: true
    }
  })

  // If user doesn't exist, create them with a default workspace
  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName || '',
        lastname: user.lastName || '',
        workspaces: {
          create: {
            name: `${user.firstName || ''} ${user.lastName || ''}'s Workspace`.trim(),
            description: 'My default workspace'
          }
        }
      },
      include: {
        workspaces: true
      }
    })
  }
  // If user exists but has no workspace, create a default one
  else if (dbUser.workspaces.length === 0) {
    await db.workspace.create({
      data: {
        name: `${user.firstName || ''} ${user.lastName || ''}'s Workspace`.trim(),
        description: 'My default workspace',
        userId: dbUser.id
      }
    })
    // Refresh user data to include new workspace
    dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      include: { workspaces: true }
    })
  }

  if (!dbUser || !dbUser.workspaces[0]) {
    return redirect('/error')
  }

  // Redirect to the first workspace
  return redirect(`/dashboard/${dbUser.workspaces[0].id}/agents`)
}

export default Page
