import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AutomationState {
  trigger: {
    type: string | null
    keyword: string | null
    types: string[]
    keywords: string[]
  }
  conversation: {
    context: string[]
    lastResponse: string | null
    messageCount: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: AutomationState = {
  trigger: {
    type: null,
    keyword: null,
    types: [],
    keywords: []
  },
  conversation: {
    context: [],
    lastResponse: null,
    messageCount: 0
  },
  isLoading: false,
  error: null
}

export const AUTOMATION = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    TRIGGER: (state, action: PayloadAction<{ type: string | null, keyword: string | null, types: string[], keywords: string[] }>) => {
      state.trigger.type = action.payload.type
      state.trigger.keyword = action.payload.keyword
      state.trigger.types = action.payload.types
      state.trigger.keywords = action.payload.keywords
      state.error = null
    },
    UPDATE_CONVERSATION: (
      state,
      action: PayloadAction<{
        message: string
        response?: string
      }>
    ) => {
      // Add message to context
      state.conversation.context.push(action.payload.message)
      
      // Update last response if provided
      if (action.payload.response) {
        state.conversation.lastResponse = action.payload.response
      }
      
      // Increment message count
      state.conversation.messageCount++
      
      // Keep only last 5 messages for context
      if (state.conversation.context.length > 5) {
        state.conversation.context = state.conversation.context.slice(-5)
      }
      
      state.error = null
    },
    RESET_CONVERSATION: (state) => {
      state.conversation = initialState.conversation
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    resetAutomation: (state) => {
      state.trigger = initialState.trigger
      state.conversation = initialState.conversation
      state.isLoading = false
      state.error = null
    }
  },
})

export const { 
  TRIGGER, 
  UPDATE_CONVERSATION, 
  RESET_CONVERSATION, 
  setLoading, 
  setError, 
  resetAutomation 
} = AUTOMATION.actions

export default AUTOMATION.reducer
