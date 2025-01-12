'use server'

import { client } from '@/lib/prisma'

export const deleteAutomation = async (automationId: string) => {
  console.log('Starting deletion of automation:', automationId)
  
  try {
    // Delete all related records sequentially instead of in a transaction
    // Delete keywords
    const deletedKeywords = await client.keyword.deleteMany({
      where: { automationId }
    })
    console.log('Deleted keywords:', deletedKeywords.count)

    // Delete triggers
    const deletedTriggers = await client.trigger.deleteMany({
      where: { automationId }
    })
    console.log('Deleted triggers:', deletedTriggers.count)

    // Delete listener if exists
    const listener = await client.listener.findUnique({
      where: { automationId }
    })
    if (listener) {
      await client.listener.delete({
        where: { automationId }
      })
      console.log('Deleted listener')
    }

    // Delete posts
    const deletedPosts = await client.post.deleteMany({
      where: { automationId }
    })
    console.log('Deleted posts:', deletedPosts.count)

    // Delete DMs
    const deletedDMs = await client.dms.deleteMany({
      where: { automationId }
    })
    console.log('Deleted DMs:', deletedDMs.count)

    // Finally delete the automation itself
    await client.automation.delete({
      where: { id: automationId }
    })
    console.log('Deleted automation')

    console.log('Successfully completed deletion')
    return { success: true }
  } catch (error) {
    console.error('Error deleting automation:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete automation'
    }
  }
}
