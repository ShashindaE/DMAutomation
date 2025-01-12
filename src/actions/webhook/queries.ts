import { client } from '@/lib/prisma'

export const matchKeyword = async (keyword: string) => {
  return await client.keyword.findFirst({
    where: {
      word: {
        equals: keyword,
        mode: 'insensitive',
      },
    },
  })
}

export const getKeywordAutomation = async (
  automationId: string,
  dm: boolean
) => {
  return await client.automation.findUnique({
    where: {
      id: automationId,
    },

    include: {
      dms: dm,
      trigger: {
        where: {
          type: dm ? 'DM' : 'COMMENT',
        },
      },
      listener: true,
      User: {
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
          integrations: {
            select: {
              token: true,
            },
          },
        },
      },
    },
  })
}

export const trackResponses = async (
  automationId: string,
  type: 'COMMENT' | 'DM',
  message: string,
  response?: string
) => {
  try {
    // Track response based on type
    if (type === 'COMMENT') {
      // Track comment response
      await client.listener.update({
        where: { automationId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      })

      // Store comment details
      await client.dms.create({
        data: {
          automationId,
          message: response,
          createdAt: new Date(),
        },
      })
    } else if (type === 'DM') {
      // Track DM response
      await client.listener.update({
        where: { automationId },
        data: {
          dmCount: {
            increment: 1,
          },
        },
      })

      // Store DM details
      await client.dms.create({
        data: {
          automationId,
          message: response,
          createdAt: new Date(),
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error tracking response:', error)
    throw error
  }
}

export const getResponseHistory = async (automationId: string) => {
  try {
    // Get automation with its DMs
    const automation = await client.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        dms: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        listener: true,
      },
    })

    return {
      messages: automation?.dms || [],
      stats: {
        dmCount: automation?.listener?.dmCount || 0,
        commentCount: automation?.listener?.commentCount || 0,
      },
    }
  } catch (error) {
    console.error('Error getting response history:', error)
    throw error
  }
}

export const createChatHistory = (
  automationId: string,
  sender: string,
  reciever: string,
  message: string
) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      dms: {
        create: {
          reciever,
          senderId: sender,
          message,
        },
      },
    },
  })
}

export const getKeywordPost = async (postId: string, automationId: string) => {
  return await client.post.findFirst({
    where: {
      AND: [{ postid: postId }, { automationId }],
    },
    select: { automationId: true },
  })
}

export const getChatHistory = async (sender: string, reciever: string) => {
  const history = await client.dms.findMany({
    where: {
      AND: [{ senderId: sender }, { reciever }],
    },
    orderBy: { createdAt: 'asc' },
  })
  const chatSession: {
    role: 'assistant' | 'user'
    content: string
  }[] = history.map((chat) => {
    return {
      role: chat.reciever ? 'assistant' : 'user',
      content: chat.message!,
    }
  })

  return {
    history: chatSession,
    automationId: history[history.length - 1].automationId,
  }
}
