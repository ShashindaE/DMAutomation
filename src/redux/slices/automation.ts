import { duplicateValidation } from '@/lib/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IntialStateTriggerProps = {
  trigger?: {
    type?: 'COMMENT' | 'DM'
    keyword?: string
    types?: string[]
    keywords?: string[]
  }
  conversation?: {
    context: string[]
    lastResponse?: string
    messageCount: number
  }
}

const InitialState: IntialStateTriggerProps = {
  trigger: {
    type: undefined,
    keyword: undefined,
    types: [],
    keywords: [],
  },
  conversation: {
    context: [],
    lastResponse: undefined,
    messageCount: 0
  }
}

export const AUTOMATION = createSlice({
  name: 'automation',
  initialState: InitialState,
  reducers: {
    TRIGGER: (state, action: PayloadAction<IntialStateTriggerProps>) => {
      state.trigger!.types = duplicateValidation(
        state.trigger?.types!,
        action.payload.trigger?.type!
      )
      return state
    },
    UPDATE_CONVERSATION: (
      state,
      action: PayloadAction<{
        message: string
        response?: string
      }>
    ) => {
      // Add message to context
      state.conversation!.context.push(action.payload.message)
      
      // Update last response if provided
      if (action.payload.response) {
        state.conversation!.lastResponse = action.payload.response
      }
      
      // Increment message count
      state.conversation!.messageCount++
      
      // Keep only last 5 messages for context
      if (state.conversation!.context.length > 5) {
        state.conversation!.context = state.conversation!.context.slice(-5)
      }
      
      return state
    },
    RESET_CONVERSATION: (state) => {
      state.conversation = InitialState.conversation
      return state
    }
  },
})

export const { TRIGGER, UPDATE_CONVERSATION, RESET_CONVERSATION } = AUTOMATION.actions
export default AUTOMATION.reducer
