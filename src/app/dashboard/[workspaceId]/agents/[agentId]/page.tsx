import React from 'react';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AgentMetrics } from '@/components/global/agents/agent-metrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentForm } from '@/components/global/agents/agent-form';
import { AgentConfig, AgentPerformanceMetrics as AgentMetricsType, AgentCapability } from '@/lib/ai/agents/types';
import { updateAgentMetricsPeriod, updateAgentSettings } from './actions';

interface PageProps {
  params: {
    workspaceId: string;
    agentId: string;
  };
}

const AgentPage = async ({ params }: PageProps) => {
  const user = await auth();
  if (!user) {
    redirect('/auth-callback?origin=dashboard');
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: params.workspaceId,
      userId: user.id,
    },
  });
  
  if (!workspace) {
    redirect('/dashboard');
  }

  const agent = await db.agent.findUnique({
    where: {
      id: params.agentId,
      workspaceId: workspace.id,
    },
    include: {
      metrics: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 30,
      },
      conversations: {
        orderBy: {
          startedAt: 'desc',
        },
        take: 10,
        include: {
          automation: true,
        },
      },
    },
  });

  if (!agent) {
    redirect(`/dashboard/${params.workspaceId}/agents`);
  }

  // Ensure metricsPeriod is one of the valid values
  const validPeriod = (agent.metricsPeriod === 'DAILY' || 
                      agent.metricsPeriod === 'WEEKLY' || 
                      agent.metricsPeriod === 'MONTHLY') 
    ? agent.metricsPeriod 
    : 'DAILY';

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{agent.name}</h1>
        <p className="text-muted-foreground mt-2">{agent.description}</p>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <AgentMetrics
            metrics={agent.metrics as AgentMetricsType[]}
            period={validPeriod}
            agentId={agent.id}
            onPeriodChange={updateAgentMetricsPeriod.bind(null, agent.id)}
          />
        </TabsContent>

        <TabsContent value="settings">
          <AgentForm
            initialData={{
              id: agent.id,
              name: agent.name,
              description: agent.description,
              model: agent.model,
              temperature: agent.temperature,
              maxTokens: agent.maxTokens,
              systemPrompt: agent.systemPrompt,
              capabilities: agent.capabilities as AgentCapability[],
              active: agent.active,
              createdAt: agent.createdAt,
              updatedAt: agent.updatedAt,
            }}
            onSubmit={updateAgentSettings.bind(null, agent.id, params.workspaceId)}
            onCancel={() => redirect(`/dashboard/${params.workspaceId}/agents`)}
          />
        </TabsContent>

        <TabsContent value="training">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Training functionality coming soon</h3>
            <p className="text-muted-foreground mt-2">
              Stay tuned for updates on agent training capabilities
            </p>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Conversation history coming soon</h3>
            <p className="text-muted-foreground mt-2">
              Stay tuned for updates on conversation tracking
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentPage;
