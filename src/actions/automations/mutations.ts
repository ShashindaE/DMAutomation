'use server'

import { client } from '@/lib/prisma'

enum LISTENERS {
  MESSAGE = 'MESSAGE',
  COMMENT = 'COMMENT',
  SMARTAI = 'SMARTAI'
}

enum TRIGGER_TYPES {
  COMMENT = 'COMMENT',
  DM = 'DM'
}

export async function updateTrigger(
  automationId: string,
  triggers: string[]
) {
  try {
    // Validate trigger types
    const validTriggers = triggers.filter(type => 
      Object.values(TRIGGER_TYPES).includes(type as TRIGGER_TYPES)
    );

    if (validTriggers.length === 0) {
      throw new Error('No valid trigger types provided');
    }

    // First, delete existing triggers
    await client.trigger.deleteMany({
      where: {
        automationId,
      },
    })

    // If changing from comment to DM only, delete posts
    const hasComment = validTriggers.includes(TRIGGER_TYPES.COMMENT)
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
            data: validTriggers.map(type => ({ type, automationId })),
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

    return { status: 200, data: automation }
  } catch (error) {
    console.error('Error updating trigger:', error);
    return { status: 500, data: null }
  }
}

export async function saveListener(
  automationId: string,
  listener: LISTENERS,
  prompt: string,
  commentReply: string | null = null,
  agentId: string | null = null
) {
  try {
    // Update or create listener
    const automation = await client.automation.update({
      where: { id: automationId },
      data: {
        listener: {
          upsert: {
            create: {
              listener,
              prompt,
              commentReply,
              agentId
            },
            update: {
              listener,
              prompt,
              commentReply,
              agentId
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
