import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid'

export const onBoardUser = async () => {
  try {
    const { userId } = await auth()
    if (!userId) {
      return {
        status: 401,
        error: 'Unauthorized',
      }
    }

    // Get or create user's workspace
    const workspace = await db.workspace.findFirst({
      where: { userId },
    })

    if (workspace) {
      return {
        status: 200,
        data: { workspaceId: workspace.id },
      }
    }

    // Create a new workspace with UUID
    const newWorkspace = await db.workspace.create({
      data: {
        id: uuidv4(),
        userId,
      },
    })

    return {
      status: 201,
      data: { workspaceId: newWorkspace.id },
    }
  } catch (error) {
    console.error('Error in onBoardUser:', error)
    return {
      status: 500,
      error: 'Internal Server Error',
    }
  }
}
