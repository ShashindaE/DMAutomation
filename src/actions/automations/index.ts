'use server'

import { onCurrentUser } from '../user'
import { createUser, findUser } from '../user/queries'
import {
  addKeyWord,
  addListener,
  addPost,
  addTrigger,
  createAutomation,
  deleteKeywordQuery,
  findAutomation,
  getAutomations,
  updateAutomation,
} from './queries'

export { addKeyWord }
export { addListener }
export { addPost }
export { addTrigger }
export { createAutomation }
export { deleteKeywordQuery }
export { findAutomation }
export { getAutomations }
export { updateAutomation }

export const createAutomations = async (id?: string) => {
  const clerk = await onCurrentUser()
  try {
    // First ensure user exists in database
    let dbUser = await findUser(clerk.id)
    if (!dbUser) {
      // Create user with required fields
      await createUser(
        clerk.id,
        clerk.firstName || '',
        clerk.lastName || '',
        clerk.emailAddresses[0].emailAddress
      )
      // Fetch the newly created user to get full user object
      dbUser = await findUser(clerk.id)
      if (!dbUser) {
        throw new Error('Failed to create user')
      }
    }

    const create = await createAutomation(clerk.id, id)
    if (create) {
      return { 
        status: 200, 
        data: 'Automation created', 
        res: create 
      }
    }

    return { 
      status: 404, 
      data: 'Oops! something went wrong',
      res: null
    }
  } catch (error) {
    console.error('Error in createAutomations:', error)
    return { 
      status: 500, 
      data: 'Internal server error',
      res: null
    }
  }
}

export const getAllAutomations = async () => {
  const user = await onCurrentUser()
  try {
    const automations = await getAutomations(user.id)
    if (!automations) {
      console.log('No automations found for user:', user.id)
      return { status: 404, data: [] }
    }
    return { status: 200, data: automations.automations }
  } catch (error) {
    console.error('Error fetching automations:', error)
    return { status: 500, data: [] }
  }
}

export const getAutomationInfo = async (id: string) => {
  try {
    const automation = await findAutomation(id)
    if (!automation) {
      console.log('No automation found with id:', id)
      return { status: 404, data: null }
    }
    return { status: 200, data: automation }
  } catch (error) {
    console.error('Error fetching automation:', error)
    return { status: 500, data: null }
  }
}

export const updateAutomationName = async (
  automationId: string,
  data: {
    name?: string
    active?: boolean
    automation?: string
  }
) => {
  await onCurrentUser()
  try {
    const update = await updateAutomation(automationId, data)
    if (update) {
      return { status: 200, data: 'Automation successfully updated' }
    }
    return { status: 404, data: 'Oops! could not find automation' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const saveListener = async (
  autmationId: string,
  listener: 'SMARTAI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  await onCurrentUser()
  try {
    const create = await addListener(autmationId, listener, prompt, reply)
    if (create) return { status: 200, data: 'Listener created' }
    return { status: 404, data: 'Cant save listener' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const saveTrigger = async (automationId: string, trigger: string[]) => {
  await onCurrentUser()
  try {
    const create = await addTrigger(automationId, trigger)
    if (create) return { status: 200, data: 'Trigger saved' }
    return { status: 404, data: 'Cannot save trigger' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const saveKeyword = async (automationId: string, keyword: string) => {
  await onCurrentUser()
  try {
    const create = await addKeyWord(automationId, keyword)

    if (create) return { status: 200, data: 'Keyword added successfully' }

    return { status: 404, data: 'Cannot add this keyword' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const deleteKeyword = async (id: string) => {
  await onCurrentUser()
  try {
    const deleted = await deleteKeywordQuery(id)
    if (deleted)
      return {
        status: 200,
        data: 'Keyword deleted',
      }
    return { status: 404, data: 'Keyword not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const getProfilePosts = async () => {
  const user = await onCurrentUser()
  try {
    const profile = await findUser(user.id)
    if (!profile?.integrations?.[0]?.token) {
      console.log('🔴 No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const posts = await fetch(
      `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${profile.integrations[0].token}`
    )
    const parsed = await posts.json()
    if (parsed) return { status: 200, data: parsed }
    
    console.log('🔴 Error in getting posts')
    return { status: 404, message: 'Error fetching posts' }
  } catch (error) {
    console.log('🔴 server side Error in getting posts ', error)
    return { status: 500, message: 'Server error while fetching posts' }
  }
}

export const savePosts = async (
  autmationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  }[]
) => {
  await onCurrentUser()
  try {
    const create = await addPost(autmationId, posts)

    if (create) return { status: 200, data: 'Posts attached' }

    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const activateAutomation = async (id: string, state: boolean) => {
  await onCurrentUser()
  try {
    const update = await updateAutomation(id, { active: state })
    if (update)
      return {
        status: 200,
        data: `Automation ${state ? 'activated' : 'disabled'}`,
      }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}
