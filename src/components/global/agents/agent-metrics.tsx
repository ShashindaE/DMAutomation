'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AgentPerformanceMetrics } from '@/lib/ai/agents/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface AgentMetricsProps {
  metrics: AgentPerformanceMetrics[];
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  agentId: string;
  onPeriodChange: (period: 'DAILY' | 'WEEKLY' | 'MONTHLY') => Promise<void>;
}

export function AgentMetrics({
  metrics,
  period,
  agentId,
  onPeriodChange,
}: AgentMetricsProps) {
  const formatMetricsForChart = (
    metrics: AgentPerformanceMetrics[]
  ) => {
    return metrics.map((m) => ({
      timestamp: new Date(m.timestamp).toLocaleDateString(),
      responseTime: m.metrics.averageResponseTime,
      successRate: m.metrics.successRate * 100,
      satisfaction: m.metrics.userSatisfactionScore * 100,
      errorRate: m.metrics.errorRate * 100,
    }));
  };

  const formatQueriesForChart = (
    metrics: AgentPerformanceMetrics[]
  ) => {
    const queriesMap = new Map<string, number>();
    
    metrics.forEach((m) => {
      m.metrics.commonQueries.forEach(({ query, count }) => {
        queriesMap.set(query, (queriesMap.get(query) || 0) + count);
      });
    });

    return Array.from(queriesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({
        query: query.length > 20 ? query.substring(0, 20) + '...' : query,
        count,
      }));
  };

  const chartData = formatMetricsForChart(metrics);
  const queryData = formatQueriesForChart(metrics);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
        <Select 
          value={period} 
          onValueChange={(value: 'DAILY' | 'WEEKLY' | 'MONTHLY') => {
            onPeriodChange(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time & Success Rate</CardTitle>
            <CardDescription>
              Average response time (ms) and success rate (%)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#8884d8"
                  name="Response Time (ms)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="successRate"
                  stroke="#82ca9d"
                  name="Success Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Satisfaction & Error Rate</CardTitle>
            <CardDescription>
              User satisfaction score (%) and error rate (%)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#8884d8"
                  name="Satisfaction (%)"
                />
                <Line
                  type="monotone"
                  dataKey="errorRate"
                  stroke="#ff0000"
                  name="Error Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Common Queries</CardTitle>
            <CardDescription>
              Most frequent user queries
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="query" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
