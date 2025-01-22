'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function toggleAgentActive(formData: FormData) {
  const agentId = formData.get('agentId') as string
  const active = formData.get('active') === 'true'

  try {
    const agent = await db.agent.update({
      where: { id: agentId },
      data: { active }
    })
    revalidatePath('/dashboard/[workspaceId]/agents')
    return { success: true, data: agent }
  } catch (error) {
    console.error('Error toggling agent active state:', error)
    return { success: false, error: 'Failed to update agent status' }
  }
}

export async function deleteAgent(formData: FormData) {
  const agentId = formData.get('agentId') as string

  try {
    await db.agent.delete({
      where: { id: agentId }
    })
    revalidatePath('/dashboard/[workspaceId]/agents')
    return { success: true }
  } catch (error) {
    console.error('Error deleting agent:', error)
    return { success: false, error: 'Failed to delete agent' }
  }
}
