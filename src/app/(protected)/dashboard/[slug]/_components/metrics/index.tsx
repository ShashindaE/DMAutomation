'use client'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { useMetrics } from '@/hooks/use-metrics'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from 'recharts'
import { Loader2 } from 'lucide-react'

type ChartData = {
  date: string
  responses: number
  successRate: number
}

type Props = {}

type CustomTooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Responses
            </span>
            <span className="font-bold">
              {payload[0].value}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Success Rate
            </span>
            <span className="font-bold">
              {payload[1].value}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  responses: {
    label: 'Responses',
    color: 'hsl(var(--chart-1))',
  },
  successRate: {
    label: 'Success Rate',
    color: 'hsl(var(--chart-2))',
  },
}

const Chart = (props: Props) => {
  const { metrics, isLoading } = useMetrics()

  if (isLoading) {
    return (
      <Card className="border-none p-0">
        <CardContent className="p-0 h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const chartData: ChartData[] = metrics?.dailyMetrics.map(metric => ({
    date: metric.date,
    responses: metric.responses,
    successRate: parseFloat(metric.successRate.toFixed(1)),
  })) || []

  return (
    <Card className="border-none p-0">
      <CardContent className="p-0">
        <ResponsiveContainer height={300} width={'100%'}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: 'hsl(var(--text-secondary))' }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              dx={-10}
              tick={{ fill: 'hsl(var(--text-secondary))' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              dx={10}
              tick={{ fill: 'hsl(var(--text-secondary))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="responses"
              stroke={chartConfig.responses.color}
              fill={chartConfig.responses.color}
              fillOpacity={0.2}
              yAxisId="left"
            />
            <Area
              type="monotone"
              dataKey="successRate"
              stroke={chartConfig.successRate.color}
              fill={chartConfig.successRate.color}
              fillOpacity={0.2}
              yAxisId="right"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default Chart
