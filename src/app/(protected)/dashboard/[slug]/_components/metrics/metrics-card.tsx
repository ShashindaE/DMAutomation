'use client'
import { useMetrics } from '@/hooks/use-metrics'
import React from 'react'
import { Loader2 } from 'lucide-react'

type Props = {}

const MetricsCard = (props: Props) => {
  const { metrics, isLoading } = useMetrics()

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const cards = [
    {
      title: 'Comments',
      subtitle: 'On your posts',
      value: metrics?.responsesByType.comments || 0,
      total: metrics?.responsesByType.comments || 0,
      successRate: metrics?.successRate || 0,
    },
    {
      title: 'Direct Messages',
      subtitle: 'On your account',
      value: metrics?.responsesByType.dms || 0,
      total: metrics?.responsesByType.dms || 0,
      successRate: metrics?.successRate || 0,
    },
  ]

  return (
    <div className="h-full flex lg:flex-row flex-col gap-5 items-end">
      {cards.map((card, i) => (
        <div
          key={i}
          className="p-5 border-[1px] flex flex-col gap-y-20 rounded-xl w-full lg:w-6/12"
        >
          <div>
            <h2 className="text-3xl text-white font-bold">{card.title}</h2>
            <p className="text-sm text-text-secondary">{card.subtitle}</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">{card.successRate.toFixed(1)}%</h3>
            <p className="text-sm text-text-secondary">
              {card.value} out of {card.total} {card.title.toLowerCase()} replied
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Average response time: {(metrics?.averageResponseTime || 0).toFixed(1)}s
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MetricsCard
