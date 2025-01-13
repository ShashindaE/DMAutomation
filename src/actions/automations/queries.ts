'use server'

import { client } from '@/lib/prisma'
import { v4 } from 'uuid'

export const createAutomation = async (clerkId: string, id?: string) => {
  try {
    return await client.user.update({
      where: {
        clerkId,
      },
      data: {
        automations: {
          create: {
            id: id || v4(),
            name: 'Untitled',
            active: false,
          },
        },
      },
      include: {
        automations: true,
      },
    })
  } catch (error) {
    console.error('Error creating automation:', error)
    throw error
  }
}

export const getAutomations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      automations: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          keywords: true,
          listener: true,
        },
      },
    },
  })
}

export const findAutomation = async (id: string) => {
  return await client.automation.findUnique({
    where: {
      id,
    },
    include: {
      keywords: true,
      trigger: true,
      posts: true,
      listener: true,
      User: {
        select: {
          subscription: true,
          integrations: true,
        },
      },
    },
  })
}

export const updateAutomation = async (
  id: string,
  update: {
    name?: string
    active?: boolean
  }
) => {
  return await client.automation.update({
    where: { id },
    data: {
      name: update.name,
      active: update.active,
    },
  })
}

export const addListener = async (
  automationId: string,
  listener: 'SMARTAI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      listener: {
        create: {
          listener,
          prompt,
          commentReply: reply,
        },
      },
    },
    include: {
      listener: true,
      trigger: true,
      keywords: true,
    },
  })
}

export const addTrigger = async (automationId: string, trigger: string[]) => {
  if (trigger.length === 2) {
    return await client.automation.update({
      where: { id: automationId },
      data: {
        trigger: {
          createMany: {
            data: [{ type: trigger[0] }, { type: trigger[1] }],
          },
        },
      },
    })
  }
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      trigger: {
        create: {
          type: trigger[0],
        },
      },
    },
  })
}

export const addKeyWord = async (automationId: string, keyword: string) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      keywords: {
        create: {
          word: keyword,
        },
      },
    },
  })
}

export const deleteKeywordQuery = async (id: string) => {
  return client.keyword.delete({
    where: { id },
  })
}

export const addPost = async (
  autmationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  }[]
) => {
  try {
    return await client.automation.update({
      where: {
        id: autmationId,
      },
      data: {
        posts: {
          createMany: {
            data: posts.map(post => ({
              ...post,
              mediaType: post.mediaType
            })),
          },
        },
      },
      include: {
        keywords: true,
        trigger: true,
        listener: true,
      },
    })
  } catch (error) {
    console.error('Error adding post:', error)
    throw error
  }
}

export const searchAutomations = async (
  clerkId: string,
  query: string
) => {
  if (!clerkId || !query) {
    return { data: [] }
  }

  try {
    const user = await client.user.findUnique({
      where: {
        clerkId: clerkId.toString(),
      },
      select: {
        automations: {
          where: {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                keywords: {
                  some: {
                    word: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
          include: {
            keywords: true,
            trigger: true,
            listener: true,
          },
          take: 5,
        },
      },
    })

    return { data: user?.automations || [] }
  } catch (error) {
    console.error('Error searching automations:', error)
    return { error: 'Failed to search automations', data: [] }
  }
}
