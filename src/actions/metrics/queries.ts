import { client } from '@/lib/prisma'
import { Automation, Listener, User } from '@prisma/client'

export type MetricsResponse = {
  totalResponses: number
  successRate: number
  averageResponseTime: number
  activeAutomations: number
  responsesByType: {
    comments: number
    dms: number
  }
  dailyMetrics: Array<{
    date: string
    responses: number
    successRate: number
    responseTime: number
  }>
}

type AutomationWithListener = Automation & {
  listener: Listener | null
}

type UserWithAutomations = User & {
  automations: AutomationWithListener[]
}

export const getMetrics = async (clerkId: string, days: number = 30): Promise<MetricsResponse> => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const user = await client.user.findUnique({
    where: { clerkId },
    include: {
      automations: {
        include: {
          listener: true
        }
      }
    }
  }) as UserWithAutomations | null

  if (!user) {
    throw new Error('User not found')
  }

  // Calculate total responses
  const totalComments = user.automations.reduce((sum: number, a: AutomationWithListener) => 
    sum + (a.listener?.commentCount || 0), 0)
  const totalDms = user.automations.reduce((sum: number, a: AutomationWithListener) => 
    sum + (a.listener?.dmCount || 0), 0)
  const totalResponses = totalComments + totalDms

  // For now, we'll assume all responses are successful since we don't track failures
  const successRate = 100

  // Since we don't track response time yet, we'll use a placeholder
  const averageResponseTime = 1.5 // seconds

  // Count active automations
  const activeAutomations = user.automations.filter(a => a.active).length

  // Get responses by type
  const responsesByType = {
    comments: totalComments,
    dms: totalDms
  }

  // Calculate daily metrics
  // For now, we'll distribute the responses evenly across the days
  const dailyMetrics = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const avgResponsesPerDay = Math.floor(totalResponses / days)
    
    return {
      date: date.toISOString().split('T')[0],
      responses: avgResponsesPerDay,
      successRate: successRate,
      responseTime: averageResponseTime
    }
  })

  return {
    totalResponses,
    successRate,
    averageResponseTime,
    activeAutomations,
    responsesByType,
    dailyMetrics
  }
}
