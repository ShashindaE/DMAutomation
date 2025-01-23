'use server'

import { client } from '@/lib/prisma'

export async function updateTrigger(
  automationId: string,
  triggers: string[]
) {
  try {
    // First, delete existing triggers
    await client.trigger.deleteMany({
      where: {
        automationId,
      },
    })

    // If changing from comment to DM only, delete posts
    const hasComment = triggers.includes('COMMENT')
    if (!hasComment) {
      await client.post.deleteMany({
        where: {
          automationId,
        },
      })
    }

    // Create new triggers
    const automation = await client.automation.update({
      where: { id: automationId },
      data: {
        trigger: {
          createMany: {
            data: triggers.map(type => ({ type })),
          },
        },
      },
      include: {
        trigger: true,
        keywords: true,
        posts: true,
        listener: true,
      },
    })

    return automation
  } catch (error) {
    console.error('Error updating trigger:', error)
    throw error
  }
}

export async function saveListener(
  automationId: string,
  listener: 'MESSAGE' | 'SMARTAI',
  prompt: string,
  reply?: string
) {
  try {
    const automation = await client.automation.update({
      where: { id: automationId },
      data: {
        listener: {
          upsert: {
            create: {
              listener,
              prompt,
              commentReply: reply,
            },
            update: {
              listener,
              prompt,
              commentReply: reply,
            },
          },
        },
      },
      include: {
        trigger: true,
        keywords: true,
        posts: true,
        listener: true,
      },
    })
    return automation
  } catch (error) {
    console.error('Error saving listener:', error)
    throw error
  }
}
