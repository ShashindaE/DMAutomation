import axios, { AxiosError, AxiosResponse } from 'axios'

interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface MessageResponse {
  message_id: string
  recipient_id: string
  status: string
}

interface FetchError extends Error {
  status?: number
  statusText?: string
}

export const refreshToken = async (token: string): Promise<TokenResponse> => {
  try {
    const response: AxiosResponse<TokenResponse> = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    )

    if (!response.data.access_token) {
      throw new Error('No access token received in response')
    }

    return response.data
  } catch (error) {
    console.error('Error in refreshToken:', error)
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error('An unknown error occurred while refreshing token')
  }
}

export const sendDM = async (
  userId: string,
  receiverId: string,
  prompt: string,
  token: string
): Promise<MessageResponse> => {
  try {
    console.log('sending message')
    const response: AxiosResponse<MessageResponse> = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
      {
        recipient: {
          id: receiverId,
        },
        message: {
          text: prompt,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error in sendDM:', error)
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error('An unknown error occurred while sending DM')
  }
}

export const sendPrivateMessage = async (
  userId: string,
  receiverId: string,
  prompt: string,
  token: string
): Promise<MessageResponse> => {
  try {
    console.log('sending message')
    const response: AxiosResponse<MessageResponse> = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
      {
        recipient: {
          comment_id: receiverId,
        },
        message: {
          text: prompt,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error in sendPrivateMessage:', error)
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error('An unknown error occurred while sending private message')
  }
}

export const generateTokens = async (code: string): Promise<TokenResponse> => {
  try {
    console.log('Starting token generation with code:', code)
    const insta_form = new FormData()
    insta_form.append('client_id', process.env.INSTAGRAM_CLIENT_ID || '')
    insta_form.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '')
    insta_form.append('grant_type', 'authorization_code')
    insta_form.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI || '')
    insta_form.append('code', code)

    const shortTokenRes: Response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: insta_form,
    })

    if (!shortTokenRes.ok) {
      const error = new Error('Failed to get short token') as FetchError
      error.status = shortTokenRes.status
      error.statusText = shortTokenRes.statusText
      throw error
    }

    const token: TokenResponse = await shortTokenRes.json()

    if (!token.access_token) {
      throw new Error('No access token received in response')
    }

    console.log('Getting long-lived token...')
    const long_token: AxiosResponse<TokenResponse> = await axios.get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
    )

    return long_token.data
  } catch (error) {
    console.error('Error in generateTokens:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unknown error occurred while generating tokens')
  }
}
